import { SQSClient, SNSClient, SESClient } from '@aws-sdk/client-sqs';
import { env } from './env.config';

// Configuração do AWS SQS
export const sqsClient = new SQSClient({
  region: env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Configuração do AWS SNS (para notificações push)
export const snsClient = new SNSClient({
  region: env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Configuração do AWS SES (para emails)
export const sesClient = new SESClient({
  region: env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// URLs das filas SQS
export const sqsQueues = {
  appointmentNotifications: env.AWS_SQS_APPOINTMENT_NOTIFICATIONS_QUEUE_URL || '',
  emailQueue: env.AWS_SQS_EMAIL_QUEUE_URL || '',
  smsQueue: env.AWS_SQS_SMS_QUEUE_URL || '',
  appointmentReminders: env.AWS_SQS_APPOINTMENT_REMINDERS_QUEUE_URL || '',
  appointmentCancellations: env.AWS_SQS_APPOINTMENT_CANCELLATIONS_QUEUE_URL || '',
};

// Configurações de retry e timeout
export const sqsConfig = {
  maxRetries: env.AWS_SQS_MAX_RETRIES || 3,
  visibilityTimeout: env.AWS_SQS_VISIBILITY_TIMEOUT || 30,
  messageRetentionPeriod: env.AWS_SQS_MESSAGE_RETENTION_PERIOD || 1209600, // 14 dias
  receiveMessageWaitTime: env.AWS_SQS_RECEIVE_MESSAGE_WAIT_TIME || 20,
};
