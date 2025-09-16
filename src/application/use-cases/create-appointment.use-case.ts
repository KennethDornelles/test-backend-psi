import { Injectable, Inject } from '@nestjs/common';
import { AppointmentRequest } from '../../domain/value-objects/appointment-request.vo';
import type { IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import type { IQueueService } from '../interfaces/queue.service.interface';
import type { IValidationService } from '../interfaces/validation.service.interface';
import { Logger } from '@nestjs/common';

interface ErrorWithMessage {
  message: string;
  stack?: string;
}

export interface CreateAppointmentRequest {
  psychologistId?: string;
  doctorId?: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  scheduledAt: Date;
  duration?: number;
  consultationType: 'PSYCHOLOGICAL' | 'MEDICAL';
  notes?: string;
}

export interface CreateAppointmentResponse {
  messageId: string;
  status: 'ACCEPTED';
  message: string;
}

@Injectable()
export class CreateAppointmentUseCase {
  private readonly logger = new Logger(CreateAppointmentUseCase.name);

  constructor(
    @Inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
    @Inject('IQueueService') private readonly queueService: IQueueService,
    @Inject('IValidationService')
    private readonly validationService: IValidationService,
  ) {}

  async execute(
    request: CreateAppointmentRequest,
  ): Promise<CreateAppointmentResponse> {
    this.logger.log(
      `Iniciando criação de agendamento para paciente ${request.patientId}`,
    );

    try {
      // Criar value object de request
      const appointmentRequest = new AppointmentRequest(
        request.patientId,
        request.patientName,
        request.patientEmail,
        request.scheduledAt,
        request.consultationType as any,
        request.psychologistId,
        request.doctorId,
        request.patientPhone,
        request.duration,
        request.notes,
      );

      // Validar se paciente existe
      await this.validationService.validatePatientExists(request.patientId);

      // Validar se profissional existe
      if (request.psychologistId) {
        await this.validationService.validatePsychologistExists(
          request.psychologistId,
        );
      }
      if (request.doctorId) {
        await this.validationService.validateDoctorExists(request.doctorId);
      }

      // Publicar mensagem na fila SQS
      const messageId =
        await this.queueService.publishAppointmentRequest(appointmentRequest);

      this.logger.log(`Mensagem publicada na fila com ID: ${messageId}`);

      return {
        messageId,
        status: 'ACCEPTED',
        message: 'Solicitação de agendamento enviada para processamento',
      };
    } catch (error) {
      const errorWithMessage = error as ErrorWithMessage;
      this.logger.error(
        `Erro ao criar agendamento: ${errorWithMessage.message}`,
        errorWithMessage.stack,
      );
      throw error;
    }
  }
}
