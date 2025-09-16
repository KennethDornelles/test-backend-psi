import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkingHoursDto } from '../dto/create-working-hours.dto';
import { UpdateWorkingHoursDto } from '../dto/update-working-hours.dto';
import { WorkingHoursResponseDto } from '../dto/working-hours-response.dto';

@Injectable()
export class WorkingHoursService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createWorkingHoursDto: CreateWorkingHoursDto,
  ): Promise<WorkingHoursResponseDto> {
    try {
      // Validar que pelo menos um profissional foi especificado
      if (
        !createWorkingHoursDto.psychologistId &&
        !createWorkingHoursDto.doctorId
      ) {
        throw new BadRequestException(
          'Deve ser especificado um psicólogo ou médico',
        );
      }

      // Validar que não foram especificados ambos
      if (
        createWorkingHoursDto.psychologistId &&
        createWorkingHoursDto.doctorId
      ) {
        throw new BadRequestException(
          'Deve ser especificado apenas um profissional',
        );
      }

      // Verificar se o profissional existe
      if (createWorkingHoursDto.psychologistId) {
        const psychologist = await this.prisma.psychologist.findUnique({
          where: { id: createWorkingHoursDto.psychologistId },
        });
        if (!psychologist) {
          throw new NotFoundException('Psicólogo não encontrado');
        }

        // Verificar se já existe horário para este psicólogo
        const existingWorkingHours = await this.prisma.workingHours.findUnique({
          where: { psychologistId: createWorkingHoursDto.psychologistId },
        });
        if (existingWorkingHours) {
          throw new ConflictException(
            'Psicólogo já possui horários de trabalho cadastrados',
          );
        }
      }

      if (createWorkingHoursDto.doctorId) {
        const doctor = await this.prisma.doctor.findUnique({
          where: { id: createWorkingHoursDto.doctorId },
        });
        if (!doctor) {
          throw new NotFoundException('Médico não encontrado');
        }

        // Verificar se já existe horário para este médico
        const existingWorkingHours = await this.prisma.workingHours.findUnique({
          where: { doctorId: createWorkingHoursDto.doctorId },
        });
        if (existingWorkingHours) {
          throw new ConflictException(
            'Médico já possui horários de trabalho cadastrados',
          );
        }
      }

      const workingHours = await this.prisma.workingHours.create({
        data: createWorkingHoursDto,
      });

      return new WorkingHoursResponseDto({
        id: workingHours.id,
        psychologistId: workingHours.psychologistId || undefined,
        doctorId: workingHours.doctorId || undefined,
        startTime: workingHours.startTime,
        endTime: workingHours.endTime,
        workDays: workingHours.workDays,
        lunchStart: workingHours.lunchStart || undefined,
        lunchEnd: workingHours.lunchEnd || undefined,
        createdAt: workingHours.createdAt,
        updatedAt: workingHours.updatedAt,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error('Erro ao criar horários de trabalho');
    }
  }

  async findAll(): Promise<WorkingHoursResponseDto[]> {
    const workingHours = await this.prisma.workingHours.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return workingHours.map(
      (workingHours) =>
        new WorkingHoursResponseDto({
          id: workingHours.id,
          psychologistId: workingHours.psychologistId || undefined,
          doctorId: workingHours.doctorId || undefined,
          startTime: workingHours.startTime,
          endTime: workingHours.endTime,
          workDays: workingHours.workDays,
          lunchStart: workingHours.lunchStart || undefined,
          lunchEnd: workingHours.lunchEnd || undefined,
          createdAt: workingHours.createdAt,
          updatedAt: workingHours.updatedAt,
        }),
    );
  }

  async findOne(id: string): Promise<WorkingHoursResponseDto> {
    const workingHours = await this.prisma.workingHours.findUnique({
      where: { id },
    });

    if (!workingHours) {
      throw new NotFoundException('Horários de trabalho não encontrados');
    }

    return new WorkingHoursResponseDto({
      id: workingHours.id,
      psychologistId: workingHours.psychologistId || undefined,
      doctorId: workingHours.doctorId || undefined,
      startTime: workingHours.startTime,
      endTime: workingHours.endTime,
      workDays: workingHours.workDays,
      lunchStart: workingHours.lunchStart || undefined,
      lunchEnd: workingHours.lunchEnd || undefined,
      createdAt: workingHours.createdAt,
      updatedAt: workingHours.updatedAt,
    });
  }

  async findByPsychologistId(
    psychologistId: string,
  ): Promise<WorkingHoursResponseDto | null> {
    const workingHours = await this.prisma.workingHours.findUnique({
      where: { psychologistId },
    });

    if (!workingHours) {
      return null;
    }

    return new WorkingHoursResponseDto({
      id: workingHours.id,
      psychologistId: workingHours.psychologistId || undefined,
      doctorId: workingHours.doctorId || undefined,
      startTime: workingHours.startTime,
      endTime: workingHours.endTime,
      workDays: workingHours.workDays,
      lunchStart: workingHours.lunchStart || undefined,
      lunchEnd: workingHours.lunchEnd || undefined,
      createdAt: workingHours.createdAt,
      updatedAt: workingHours.updatedAt,
    });
  }

  async findByDoctorId(
    doctorId: string,
  ): Promise<WorkingHoursResponseDto | null> {
    const workingHours = await this.prisma.workingHours.findUnique({
      where: { doctorId },
    });

    if (!workingHours) {
      return null;
    }

    return new WorkingHoursResponseDto({
      id: workingHours.id,
      psychologistId: workingHours.psychologistId || undefined,
      doctorId: workingHours.doctorId || undefined,
      startTime: workingHours.startTime,
      endTime: workingHours.endTime,
      workDays: workingHours.workDays,
      lunchStart: workingHours.lunchStart || undefined,
      lunchEnd: workingHours.lunchEnd || undefined,
      createdAt: workingHours.createdAt,
      updatedAt: workingHours.updatedAt,
    });
  }

  async update(
    id: string,
    updateWorkingHoursDto: UpdateWorkingHoursDto,
  ): Promise<WorkingHoursResponseDto> {
    try {
      // Verificar se os horários existem
      const existingWorkingHours = await this.prisma.workingHours.findUnique({
        where: { id },
      });

      if (!existingWorkingHours) {
        throw new NotFoundException('Horários de trabalho não encontrados');
      }

      const workingHours = await this.prisma.workingHours.update({
        where: { id },
        data: updateWorkingHoursDto,
      });

      return new WorkingHoursResponseDto({
        id: workingHours.id,
        psychologistId: workingHours.psychologistId || undefined,
        doctorId: workingHours.doctorId || undefined,
        startTime: workingHours.startTime,
        endTime: workingHours.endTime,
        workDays: workingHours.workDays,
        lunchStart: workingHours.lunchStart || undefined,
        lunchEnd: workingHours.lunchEnd || undefined,
        createdAt: workingHours.createdAt,
        updatedAt: workingHours.updatedAt,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Erro ao atualizar horários de trabalho');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const existingWorkingHours = await this.prisma.workingHours.findUnique({
        where: { id },
      });

      if (!existingWorkingHours) {
        throw new NotFoundException('Horários de trabalho não encontrados');
      }

      await this.prisma.workingHours.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Erro ao deletar horários de trabalho');
    }
  }
}
