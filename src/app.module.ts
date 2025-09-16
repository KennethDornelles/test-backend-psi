import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './shared/modules/users.module';
import { PsychologistModule } from './shared/modules/psychologist.module';
import { DoctorModule } from './shared/modules/doctor.module';
import { PatientModule } from './shared/modules/patient.module';
import { WorkingHoursModule } from './shared/modules/working-hours.module';
import { AppointmentModule } from './shared/modules/appointment.module';
import { ApplicationModule } from './application/application.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  imports: [
    UsersModule,
    PsychologistModule,
    DoctorModule,
    PatientModule,
    WorkingHoursModule,
    AppointmentModule,
    ApplicationModule,
    InfrastructureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
