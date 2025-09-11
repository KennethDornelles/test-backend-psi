import { Injectable, Logger } from '@nestjs/common';
import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { sqsClient, sqsQueues, sqsConfig } from '../../config/aws.config';

export interface SQSMessage {
  id: string;
  body: string;
  receiptHandle: string;
  attributes?: Record<string, string>;
}

export interface SendMessageOptions {
  queueUrl: string;
  messageBody: string;
  delaySeconds?: number;
  messageAttributes?: Record<string, any>;
  messageGroupId?: string;
  messageDeduplicationId?: string;
}

@Injectable()
export class SQSService {
  private readonly logger = new Logger(SQSService.name);

  constructor() {}

  /**
   * Envia uma mensagem para uma fila SQS
   */
  async sendMessage(options: SendMessageOptions): Promise<string> {
    try {
      const command = new SendMessageCommand({
        QueueUrl: options.queueUrl,
        MessageBody: options.messageBody,
        DelaySeconds: options.delaySeconds,
        MessageAttributes: options.messageAttributes,
        MessageGroupId: options.messageGroupId,
        MessageDeduplicationId: options.messageDeduplicationId,
      });

      const response = await sqsClient.send(command);
      
      this.logger.log(`Mensagem enviada para fila ${options.queueUrl}: ${response.MessageId}`);
      return response.MessageId || '';
    } catch (error) {
      this.logger.error(`Erro ao enviar mensagem para SQS: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Recebe mensagens de uma fila SQS
   */
  async receiveMessages(queueUrl: string, maxMessages: number = 10): Promise<SQSMessage[]> {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: maxMessages,
        WaitTimeSeconds: sqsConfig.receiveMessageWaitTime,
        VisibilityTimeoutSeconds: sqsConfig.visibilityTimeout,
        MessageAttributeNames: ['All'],
      });

      const response = await sqsClient.send(command);
      
      if (!response.Messages) {
        return [];
      }

      return response.Messages.map(message => ({
        id: message.MessageId || '',
        body: message.Body || '',
        receiptHandle: message.ReceiptHandle || '',
        attributes: message.MessageAttributes || {},
      }));
    } catch (error) {
      this.logger.error(`Erro ao receber mensagens do SQS: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Remove uma mensagem da fila SQS
   */
  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
      });

      await sqsClient.send(command);
      this.logger.log(`Mensagem removida da fila ${queueUrl}`);
    } catch (error) {
      this.logger.error(`Erro ao remover mensagem do SQS: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Envia notificação de agendamento
   */
  async sendAppointmentNotification(data: any): Promise<string> {
    return this.sendMessage({
      queueUrl: sqsQueues.appointmentNotifications,
      messageBody: JSON.stringify(data),
      messageAttributes: {
        type: { DataType: 'String', StringValue: 'appointment_notification' },
        timestamp: { DataType: 'String', StringValue: new Date().toISOString() },
      },
    });
  }

  /**
   * Envia email via SQS
   */
  async sendEmail(data: any): Promise<string> {
    return this.sendMessage({
      queueUrl: sqsQueues.emailQueue,
      messageBody: JSON.stringify(data),
      messageAttributes: {
        type: { DataType: 'String', StringValue: 'email' },
        timestamp: { DataType: 'String', StringValue: new Date().toISOString() },
      },
    });
  }

  /**
   * Envia SMS via SQS
   */
  async sendSMS(data: any): Promise<string> {
    return this.sendMessage({
      queueUrl: sqsQueues.smsQueue,
      messageBody: JSON.stringify(data),
      messageAttributes: {
        type: { DataType: 'String', StringValue: 'sms' },
        timestamp: { DataType: 'String', StringValue: new Date().toISOString() },
      },
    });
  }

  /**
   * Agenda lembrete de consulta
   */
  async scheduleAppointmentReminder(data: any, delaySeconds: number): Promise<string> {
    return this.sendMessage({
      queueUrl: sqsQueues.appointmentReminders,
      messageBody: JSON.stringify(data),
      delaySeconds,
      messageAttributes: {
        type: { DataType: 'String', StringValue: 'appointment_reminder' },
        timestamp: { DataType: 'String', StringValue: new Date().toISOString() },
      },
    });
  }

  /**
   * Processa cancelamento de consulta
   */
  async processAppointmentCancellation(data: any): Promise<string> {
    return this.sendMessage({
      queueUrl: sqsQueues.appointmentCancellations,
      messageBody: JSON.stringify(data),
      messageAttributes: {
        type: { DataType: 'String', StringValue: 'appointment_cancellation' },
        timestamp: { DataType: 'String', StringValue: new Date().toISOString() },
      },
    });
  }
}
