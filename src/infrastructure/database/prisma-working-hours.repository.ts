import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IWorkingHoursRepository } from '../../domain/repositories/working-hours.repository.interface';
import { WorkingHours } from '../../domain/entities/working-hours.entity';

@Injectable()
export class PrismaWorkingHoursRepository implements IWorkingHoursRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByPsychologistId(
    psychologistId: string,
  ): Promise<WorkingHours | null> {
    const workingHours = await this.prisma.workingHours.findUnique({
      where: { psychologistId },
    });

    return workingHours ? this.mapToEntity(workingHours) : null;
  }

  async findByDoctorId(doctorId: string): Promise<WorkingHours | null> {
    const workingHours = await this.prisma.workingHours.findUnique({
      where: { doctorId },
    });

    return workingHours ? this.mapToEntity(workingHours) : null;
  }

  async findByProfessionalId(
    professionalId: string,
  ): Promise<WorkingHours | null> {
    const workingHours = await this.prisma.workingHours.findFirst({
      where: {
        OR: [{ psychologistId: professionalId }, { doctorId: professionalId }],
      },
    });

    return workingHours ? this.mapToEntity(workingHours) : null;
  }

  private mapToEntity(data: any): WorkingHours {
    return WorkingHours.create({
      id: data.id,
      psychologistId: data.psychologistId,
      doctorId: data.doctorId,
      startTime: data.startTime,
      endTime: data.endTime,
      workDays: data.workDays,
      lunchStart: data.lunchStart,
      lunchEnd: data.lunchEnd,
    });
  }
}
