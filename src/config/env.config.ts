import { config } from 'dotenv';
import { z } from 'zod';

// Carrega as variáveis de ambiente
config();

// Schema de validação das variáveis de ambiente
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL é obrigatória'),
  
  // Database Individual Settings (opcionais, usados se DATABASE_URL não estiver definida)
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(Number).default('5432'),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().default('psi_api'),
  DB_SCHEMA: z.string().default('public'),
  
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  API_PREFIX: z.string().default('api/v1'),
  
  // JWT
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter pelo menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET deve ter pelo menos 32 caracteres'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  
  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().transform(Number).default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  
  // File Upload
  MAX_FILE_SIZE: z.string().transform(Number).default('5242880'),
  UPLOAD_PATH: z.string().default('./uploads'),
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  
  // Rate Limiting
  RATE_LIMIT_TTL: z.string().transform(Number).default('60'),
  RATE_LIMIT_LIMIT: z.string().transform(Number).default('100'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE: z.string().default('./logs/app.log'),
  
  // Health Check
  HEALTH_CHECK_PATH: z.string().default('/health'),
  
  // Swagger
  SWAGGER_PATH: z.string().default('/api/docs'),
  SWAGGER_TITLE: z.string().default('PSI API'),
  SWAGGER_DESCRIPTION: z.string().default('Sistema de Agendamento'),
  SWAGGER_VERSION: z.string().default('1.0.0'),
  
  // Pagination
  DEFAULT_PAGE_SIZE: z.string().transform(Number).default('10'),
  MAX_PAGE_SIZE: z.string().transform(Number).default('100'),
  
  // Appointments
  DEFAULT_APPOINTMENT_DURATION: z.string().transform(Number).default('60'),
  MIN_APPOINTMENT_DURATION: z.string().transform(Number).default('30'),
  MAX_APPOINTMENT_DURATION: z.string().transform(Number).default('180'),
  
  // Notifications
  ENABLE_EMAIL_NOTIFICATIONS: z.string().transform(val => val === 'true').default('true'),
  ENABLE_SMS_NOTIFICATIONS: z.string().transform(val => val === 'true').default('false'),
  SMS_API_KEY: z.string().optional(),
  SMS_API_SECRET: z.string().optional(),
  
  // Security
  BCRYPT_ROUNDS: z.string().transform(Number).default('12'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET deve ter pelo menos 32 caracteres'),
  
  // Timezone
  TZ: z.string().default('America/Sao_Paulo'),
  
  // AWS Configuration
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_SESSION_TOKEN: z.string().optional(),
  
  // AWS SQS Queues
  AWS_SQS_APPOINTMENT_NOTIFICATIONS_QUEUE_URL: z.string().optional(),
  AWS_SQS_EMAIL_QUEUE_URL: z.string().optional(),
  AWS_SQS_SMS_QUEUE_URL: z.string().optional(),
  AWS_SQS_APPOINTMENT_REMINDERS_QUEUE_URL: z.string().optional(),
  AWS_SQS_APPOINTMENT_CANCELLATIONS_QUEUE_URL: z.string().optional(),
  
  // AWS SQS Configuration
  AWS_SQS_MAX_RETRIES: z.string().transform(Number).default('3'),
  AWS_SQS_VISIBILITY_TIMEOUT: z.string().transform(Number).default('30'),
  AWS_SQS_MESSAGE_RETENTION_PERIOD: z.string().transform(Number).default('1209600'),
  AWS_SQS_RECEIVE_MESSAGE_WAIT_TIME: z.string().transform(Number).default('20'),
});

// Valida e exporta as configurações
export const env = envSchema.parse(process.env);

// Função para construir DATABASE_URL a partir das variáveis individuais
export const getDatabaseUrl = (): string => {
  if (env.DATABASE_URL) {
    return env.DATABASE_URL;
  }
  
  return `postgresql://${env.DB_USERNAME}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}?schema=${env.DB_SCHEMA}`;
};

// Exporta a URL do banco construída
export const databaseUrl = getDatabaseUrl();

// Tipos TypeScript para as configurações
export type EnvConfig = z.infer<typeof envSchema>;
