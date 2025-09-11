import { Module } from '@nestjs/common';
import { PatientService } from '../services/patient.service';
import { PatientController } from '../controllers/patient.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PatientController],
  providers: [PatientService, PrismaService],
  exports: [PatientService],
})
export class PatientModule {}
