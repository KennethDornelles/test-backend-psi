import { Injectable, Logger, Inject } from '@nestjs/common';
import { IQueueService } from '../../application/interfaces/queue.service.interface';
import { AppointmentRequest } from '../../domain/value-objects/appointment-request.vo';
import { SQSService } from '../../shared/services/sqs.service';
import { sqsQueues } from '../../config/aws.config';

@Injectable()
export class SQSQueueService implements IQueueService {
  private readonly logger = new Logger(SQSQueueService.name);

  constructor(@Inject('SQSService') private readonly sqsService: SQSService) {}

  async publishAppointmentRequest(
    appointmentRequest: AppointmentRequest,
  ): Promise<string> {
    this.logger.log('Publicando solicitação de agendamento na fila SQS');

    const messageBody = JSON.stringify({
      type: 'APPOINTMENT_REQUEST',
      data: {
        psychologistId: appointmentRequest.psychologistId,
        doctorId: appointmentRequest.doctorId,
        patientId: appointmentRequest.patientId,
        patientName: appointmentRequest.patientName,
        patientEmail: appointmentRequest.patientEmail,
        patientPhone: appointmentRequest.patientPhone,
        scheduledAt: appointmentRequest.scheduledAt.toISOString(),
        duration: appointmentRequest.duration,
        consultationType: appointmentRequest.consultationType,
        notes: appointmentRequest.notes,
      },
      timestamp: new Date().toISOString(),
    });

    const messageId = await this.sqsService.sendMessage({
      queueUrl: sqsQueues.appointmentNotifications,
      messageBody,
      messageAttributes: {
        MessageType: {
          DataType: 'String',
          StringValue: 'APPOINTMENT_REQUEST',
        },
        ProfessionalType: {
          DataType: 'String',
          StringValue: appointmentRequest.isPsychological()
            ? 'PSYCHOLOGIST'
            : 'DOCTOR',
        },
        ProfessionalId: {
          DataType: 'String',
          StringValue: appointmentRequest.getProfessionalId(),
        },
      },
    });

    this.logger.log(`Mensagem publicada com ID: ${messageId}`);
    return messageId;
  }

  async consumeAppointmentRequests(): Promise<AppointmentRequest[]> {
    this.logger.log('Consumindo mensagens da fila SQS');

    const messages = await this.sqsService.receiveMessages(
      sqsQueues.appointmentNotifications,
      10, // maxMessages
    );

    const appointmentRequests: AppointmentRequest[] = [];

    for (const message of messages) {
      try {
        const parsedMessage = JSON.parse(message.body);

        if (parsedMessage.type === 'APPOINTMENT_REQUEST') {
          const appointmentRequest = new AppointmentRequest(
            parsedMessage.data.patientId,
            parsedMessage.data.patientName,
            parsedMessage.data.patientEmail,
            new Date(parsedMessage.data.scheduledAt),
            parsedMessage.data.consultationType,
            parsedMessage.data.psychologistId,
            parsedMessage.data.doctorId,
            parsedMessage.data.patientPhone,
            parsedMessage.data.duration,
            parsedMessage.data.notes,
          );

          appointmentRequests.push(appointmentRequest);
        }
      } catch (error) {
        this.logger.error(
          `Erro ao processar mensagem ${message.id}: ${error.message}`,
          error.stack,
        );
        // Continuar processando outras mensagens
      }
    }

    this.logger.log(
      `${appointmentRequests.length} solicitações de agendamento processadas`,
    );
    return appointmentRequests;
  }

  async deleteMessage(receiptHandle: string): Promise<void> {
    await this.sqsService.deleteMessage(
      sqsQueues.appointmentNotifications,
      receiptHandle,
    );
  }
}
