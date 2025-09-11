import { Injectable, Logger } from '@nestjs/common';
import {
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  MessageAttributeValue,
} from '@aws-sdk/client-sqs';
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
  messageAttributes?: Record<string, MessageAttributeValue>;
  messageGroupId?: string;
  messageDeduplicationId?: string;
}

interface ErrorWithMessage {
  message: string;
  stack?: string;
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

      this.logger.log(
        `Mensagem enviada para fila ${options.queueUrl}: ${response.MessageId}`,
      );
      return response.MessageId || '';
    } catch (error) {
      const errorWithMessage = error as ErrorWithMessage;
      this.logger.error(
        `Erro ao enviar mensagem para SQS: ${errorWithMessage.message}`,
        errorWithMessage.stack,
      );
      throw error;
    }
  }

  /**
   * Recebe mensagens de uma fila SQS
   */
  async receiveMessages(
    queueUrl: string,
    maxMessages: number = 10,
  ): Promise<SQSMessage[]> {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl,
        MaxNumberOfMessages: maxMessages,
        WaitTimeSeconds: sqsConfig.receiveMessageWaitTime,
        VisibilityTimeout: sqsConfig.visibilityTimeout,
        MessageAttributeNames: ['All'],
      });

      const response = await sqsClient.send(command);

      if (!response.Messages) {
        return [];
      }

      return response.Messages.map((message) => {
        const attributes: Record<string, string> = {};
        if (message.MessageAttributes) {
          for (const key in message.MessageAttributes) {
            if (
              Object.prototype.hasOwnProperty.call(
                message.MessageAttributes,
                key,
              )
            ) {
              const attr = message.MessageAttributes[key];
              if (attr.StringValue) {
                attributes[key] = attr.StringValue;
              }
            }
          }
        }
        return {
          id: message.MessageId || '',
          body: message.Body || '',
          receiptHandle: message.ReceiptHandle || '',
          attributes,
        };
      });
    } catch (error) {
      const errorWithMessage = error as ErrorWithMessage;
      this.logger.error(
        `Erro ao receber mensagens do SQS: ${errorWithMessage.message}`,
        errorWithMessage.stack,
      );
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
      const errorWithMessage = error as ErrorWithMessage;
      this.logger.error(
        `Erro ao remover mensagem do SQS: ${errorWithMessage.message}`,
        errorWithMessage.stack,
      );
      throw error;
    }
  }

  /**
   * Envia notificação de agendamento
   */
  async sendAppointmentNotification(
    data: Record<string, unknown>,
  ): Promise<string> {
    return this.sendMessage({
      queueUrl: sqsQueues.appointmentNotifications,
      messageBody: JSON.stringify(data),
      messageAttributes: {
        type: { DataType: 'String', StringValue: 'appointment_notification' },
        timestamp: {
          DataType: 'String',
          StringValue: new Date().toISOString(),
        },
      },
    });
  }

  /**
   * Envia email via SQS
   */
  async sendEmail(data: Record<string, unknown>): Promise<string> {
    return this.sendMessage({
      queueUrl: sqsQueues.emailQueue,
      messageBody: JSON.stringify(data),
      messageAttributes: {
        type: { DataType: 'String', StringValue: 'email' },
        timestamp: {
          DataType: 'String',
          StringValue: new Date().toISOString(),
        },
      },
    });
  }

  /**
   * Envia SMS via SQS
   */
  async sendSMS(data: Record<string, unknown>): Promise<string> {
    return this.sendMessage({
      queueUrl: sqsQueues.smsQueue,
      messageBody: JSON.stringify(data),
      messageAttributes: {
        type: { DataType: 'String', StringValue: 'sms' },
        timestamp: {
          DataType: 'String',
          StringValue: new Date().toISOString(),
        },
      },
    });
  }

  /**
   * Agenda lembrete de consulta
   */
  async scheduleAppointmentReminder(
    data: Record<string, unknown>,
    delaySeconds: number,
  ): Promise<string> {
    return this.sendMessage({
      queueUrl: sqsQueues.appointmentReminders,
      messageBody: JSON.stringify(data),
      delaySeconds,
      messageAttributes: {
        type: { DataType: 'String', StringValue: 'appointment_reminder' },
        timestamp: {
          DataType: 'String',
          StringValue: new Date().toISOString(),
        },
      },
    });
  }

  /**
   * Processa cancelamento de consulta
   */
  async processAppointmentCancellation(
    data: Record<string, unknown>,
  ): Promise<string> {
    return this.sendMessage({
      queueUrl: sqsQueues.appointmentCancellations,
      messageBody: JSON.stringify(data),
      messageAttributes: {
        type: { DataType: 'String', StringValue: 'appointment_cancellation' },
        timestamp: {
          DataType: 'String',
          StringValue: new Date().toISOString(),
        },
      },
    });
  }
}
