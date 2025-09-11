import { Module } from '@nestjs/common';
import { DoctorService } from '../services/doctor.service';
import { DoctorController } from '../controllers/doctor.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [DoctorController],
  providers: [DoctorService, PrismaService],
  exports: [DoctorService],
})
export class DoctorModule {}
