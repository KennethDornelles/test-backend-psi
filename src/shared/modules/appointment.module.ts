import { Module } from '@nestjs/common';
import { AppointmentController } from '../controllers/appointment.controller';
import { AppointmentService } from '../services/appointment.service';
import { PrismaService } from '../../prisma/prisma.service';
// CreateAppointmentUseCase é injetado via ApplicationModule
import { ApplicationModule } from '../../application/application.module';

@Module({
  imports: [ApplicationModule],
  controllers: [AppointmentController],
  providers: [AppointmentService, PrismaService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
