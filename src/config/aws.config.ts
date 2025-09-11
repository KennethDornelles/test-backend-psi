import { SQSClient } from '@aws-sdk/client-sqs';
import { SNSClient } from '@aws-sdk/client-sns';
import { SESClient } from '@aws-sdk/client-ses';
import { env } from './env.config';

// Configuração do AWS SQS
export const sqsClient = new SQSClient({
  region: env.AWS_REGION,
  credentials:
    env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

// Configuração do AWS SNS (para notificações push)
export const snsClient = new SNSClient({
  region: env.AWS_REGION,
  credentials:
    env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

// Configuração do AWS SES (para emails)
export const sesClient = new SESClient({
  region: env.AWS_REGION,
  credentials:
    env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

// URLs das filas SQS
export const sqsQueues = {
  appointmentNotifications:
    env.AWS_SQS_APPOINTMENT_NOTIFICATIONS_QUEUE_URL ?? '',
  emailQueue: env.AWS_SQS_EMAIL_QUEUE_URL ?? '',
  smsQueue: env.AWS_SQS_SMS_QUEUE_URL ?? '',
  appointmentReminders: env.AWS_SQS_APPOINTMENT_REMINDERS_QUEUE_URL ?? '',
  appointmentCancellations:
    env.AWS_SQS_APPOINTMENT_CANCELLATIONS_QUEUE_URL ?? '',
};

// Configurações de retry e timeout
export const sqsConfig = {
  maxRetries: env.AWS_SQS_MAX_RETRIES,
  visibilityTimeout: env.AWS_SQS_VISIBILITY_TIMEOUT,
  messageRetentionPeriod: env.AWS_SQS_MESSAGE_RETENTION_PERIOD, // 14 dias
  receiveMessageWaitTime: env.AWS_SQS_RECEIVE_MESSAGE_WAIT_TIME,
};
