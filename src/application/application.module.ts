import { Module } from '@nestjs/common';
import { CreateAppointmentUseCase } from './use-cases/create-appointment.use-case';
import { ProcessAppointmentUseCase } from './use-cases/process-appointment.use-case';
// Interfaces não são importadas diretamente, apenas as implementações

// Implementações concretas
import { PrismaAppointmentRepository } from '../infrastructure/database/prisma-appointment.repository';
import { PrismaWorkingHoursRepository } from '../infrastructure/database/prisma-working-hours.repository';
import { SQSQueueService } from '../infrastructure/queue/sqs-queue.service';
import { AppointmentValidationService } from '../infrastructure/validation/appointment-validation.service';
import { EmailNotificationService } from '../infrastructure/notifications/email-notification.service';
import { PrismaService } from '../prisma/prisma.service';
import { SQSService } from '../shared/services/sqs.service';

@Module({
  providers: [
    // Use Cases
    CreateAppointmentUseCase,
    ProcessAppointmentUseCase,

    // Repositories
    {
      provide: 'IAppointmentRepository',
      useClass: PrismaAppointmentRepository,
    },
    {
      provide: 'IWorkingHoursRepository',
      useClass: PrismaWorkingHoursRepository,
    },

    // Services
    {
      provide: 'IQueueService',
      useClass: SQSQueueService,
    },
    {
      provide: 'IValidationService',
      useClass: AppointmentValidationService,
    },
    {
      provide: 'INotificationService',
      useClass: EmailNotificationService,
    },

    // Dependencies
    PrismaService,
    {
      provide: 'SQSService',
      useClass: SQSService,
    },
  ],
  exports: [CreateAppointmentUseCase, ProcessAppointmentUseCase],
})
export class ApplicationModule {}
