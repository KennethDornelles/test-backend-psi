import { Module } from '@nestjs/common';
import { WorkingHoursController } from '../controllers/working-hours.controller';
import { WorkingHoursService } from '../services/working-hours.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [WorkingHoursController],
  providers: [WorkingHoursService, PrismaService],
  exports: [WorkingHoursService],
})
export class WorkingHoursModule {}
