import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './shared/modules/users.module';
import { PsychologistModule } from './shared/modules/psychologist.module';
import { DoctorModule } from './shared/modules/doctor.module';

@Module({
  imports: [UsersModule, PsychologistModule, DoctorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
