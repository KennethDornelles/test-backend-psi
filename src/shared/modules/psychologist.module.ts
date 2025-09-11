import { Module } from '@nestjs/common';
import { PsychologistService } from '../services/psychologist.service';
import { PsychologistController } from '../controllers/psychologist.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PsychologistController],
  providers: [PsychologistService, PrismaService],
  exports: [PsychologistService],
})
export class PsychologistModule {}
