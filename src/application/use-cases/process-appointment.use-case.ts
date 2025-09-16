import { Injectable, Inject } from '@nestjs/common';
import { AppointmentRequest } from '../../domain/value-objects/appointment-request.vo';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../domain/entities/appointment.entity';
import type { IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import type { IWorkingHoursRepository } from '../../domain/repositories/working-hours.repository.interface';
import type { IValidationService } from '../interfaces/validation.service.interface';
import type { INotificationService } from '../interfaces/notification.service.interface';
import { Logger } from '@nestjs/common';

interface ErrorWithMessage {
  message: string;
  stack?: string;
}

export interface ProcessAppointmentRequest {
  appointmentRequest: AppointmentRequest;
  messageId: string;
}

export interface ProcessAppointmentResponse {
  appointmentId: string;
  status: AppointmentStatus;
  notificationSent: boolean;
}

@Injectable()
export class ProcessAppointmentUseCase {
  private readonly logger = new Logger(ProcessAppointmentUseCase.name);

  constructor(
    @Inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject('IWorkingHoursRepository')
    private readonly workingHoursRepository: IWorkingHoursRepository,
    @Inject('IValidationService')
    private readonly validationService: IValidationService,
    @Inject('INotificationService')
    private readonly notificationService: INotificationService,
  ) {}

  async execute(
    request: ProcessAppointmentRequest,
  ): Promise<ProcessAppointmentResponse> {
    this.logger.log(`Processando agendamento da mensagem ${request.messageId}`);

    try {
      const { appointmentRequest } = request;

      // Validar antecedência mínima (24 horas)
      await this.validationService.validateMinimumAntecedence(
        appointmentRequest.scheduledAt,
      );

      // Validar horário de trabalho
      await this.validationService.validateWorkingHours(
        appointmentRequest.getProfessionalId(),
        appointmentRequest.scheduledAt,
        appointmentRequest.isPsychological(),
      );

      // Verificar disponibilidade
      await this.validationService.validateAvailability(
        appointmentRequest.getProfessionalId(),
        appointmentRequest.scheduledAt,
      );

      // Criar agendamento
      const appointment = Appointment.create({
        psychologistId: appointmentRequest.psychologistId,
        doctorId: appointmentRequest.doctorId,
        patientId: appointmentRequest.patientId,
        patientName: appointmentRequest.patientName,
        patientEmail: appointmentRequest.patientEmail,
        patientPhone: appointmentRequest.patientPhone,
        scheduledAt: appointmentRequest.scheduledAt,
        duration: appointmentRequest.duration,
        consultationType: appointmentRequest.consultationType,
        status: AppointmentStatus.CONFIRMED,
        notes: appointmentRequest.notes,
      });

      // Salvar no banco
      const savedAppointment =
        await this.appointmentRepository.create(appointment);

      // Enviar notificação de confirmação
      await this.notificationService.sendAppointmentConfirmation(
        savedAppointment.patientEmail,
        savedAppointment.patientName,
        savedAppointment.scheduledAt,
        savedAppointment.psychologistId ? 'psicólogo' : 'médico',
      );

      this.logger.log(
        `Agendamento ${savedAppointment.id} confirmado e notificação enviada`,
      );

      return {
        appointmentId: savedAppointment.id,
        status: AppointmentStatus.CONFIRMED,
        notificationSent: true,
      };
    } catch (error) {
      this.logger.error(
        `Erro ao processar agendamento: ${error.message}`,
        error.stack,
      );

      // Se for erro de validação, criar agendamento como DECLINED
      if (this.isValidationError(error)) {
        try {
          const errorWithMessage = error as ErrorWithMessage;
          const declinedAppointment = Appointment.create({
            psychologistId: request.appointmentRequest.psychologistId,
            doctorId: request.appointmentRequest.doctorId,
            patientId: request.appointmentRequest.patientId,
            patientName: request.appointmentRequest.patientName,
            patientEmail: request.appointmentRequest.patientEmail,
            patientPhone: request.appointmentRequest.patientPhone,
            scheduledAt: request.appointmentRequest.scheduledAt,
            duration: request.appointmentRequest.duration,
            consultationType: request.appointmentRequest.consultationType,
            status: AppointmentStatus.DECLINED,
            cancellationReason: errorWithMessage.message,
            notes: request.appointmentRequest.notes,
          });

          const savedAppointment =
            await this.appointmentRepository.create(declinedAppointment);

          // Enviar notificação de recusa
          await this.notificationService.sendAppointmentDecline(
            savedAppointment.patientEmail,
            savedAppointment.patientName,
            savedAppointment.scheduledAt,
            errorWithMessage.message,
          );

          this.logger.log(
            `Agendamento ${savedAppointment.id} recusado e notificação enviada`,
          );

          return {
            appointmentId: savedAppointment.id,
            status: AppointmentStatus.DECLINED,
            notificationSent: true,
          };
        } catch (saveError) {
          const saveErrorWithMessage = saveError as ErrorWithMessage;
          this.logger.error(
            `Erro ao salvar agendamento recusado: ${saveErrorWithMessage.message}`,
            saveErrorWithMessage.stack,
          );
          throw saveError;
        }
      }

      throw error;
    }
  }

  private isValidationError(error: any): boolean {
    const errorWithMessage = error as ErrorWithMessage;
    return Boolean(
      errorWithMessage.message &&
      (errorWithMessage.message.includes('antecedência') ||
        errorWithMessage.message.includes('horário') ||
        errorWithMessage.message.includes('disponível') ||
        errorWithMessage.message.includes('trabalho'))
    );
  }
}
