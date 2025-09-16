import { Module } from '@nestjs/common';
import { AppointmentQueueProcessor } from './queue/appointment-queue.processor';
import { SQSQueueService } from './queue/sqs-queue.service';
import { PrismaAppointmentRepository } from './database/prisma-appointment.repository';
import { PrismaWorkingHoursRepository } from './database/prisma-working-hours.repository';
import { AppointmentValidationService } from './validation/appointment-validation.service';
import { EmailNotificationService } from './notifications/email-notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { SQSService } from '../shared/services/sqs.service';

@Module({
  providers: [
    // Queue
    AppointmentQueueProcessor,
    SQSQueueService,

    // Repositories
    PrismaAppointmentRepository,
    PrismaWorkingHoursRepository,

    // Services
    AppointmentValidationService,
    EmailNotificationService,

    // Dependencies
    PrismaService,
    {
      provide: 'SQSService',
      useClass: SQSService,
    },
  ],
  exports: [
    AppointmentQueueProcessor,
    SQSQueueService,
    PrismaAppointmentRepository,
    PrismaWorkingHoursRepository,
    AppointmentValidationService,
    EmailNotificationService,
  ],
})
export class InfrastructureModule {}
