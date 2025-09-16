import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { IValidationService } from '../../application/interfaces/validation.service.interface';
import { PrismaService } from '../../prisma/prisma.service';
import type { IWorkingHoursRepository } from '../../domain/repositories/working-hours.repository.interface';
import type { IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { Logger } from '@nestjs/common';

@Injectable()
export class AppointmentValidationService implements IValidationService {
  private readonly logger = new Logger(AppointmentValidationService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject('IWorkingHoursRepository')
    private readonly workingHoursRepository: IWorkingHoursRepository,
    @Inject('IAppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  async validatePatientExists(patientId: string): Promise<void> {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }
  }

  async validatePsychologistExists(psychologistId: string): Promise<void> {
    const psychologist = await this.prisma.psychologist.findUnique({
      where: { id: psychologistId },
    });

    if (!psychologist) {
      throw new NotFoundException('Psicólogo não encontrado');
    }
  }

  async validateDoctorExists(doctorId: string): Promise<void> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException('Médico não encontrado');
    }
  }

  async validateMinimumAntecedence(scheduledAt: Date): Promise<void> {
    const now = new Date();
    const timeDifference = scheduledAt.getTime() - now.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      throw new BadRequestException(
        'Agendamentos devem ser feitos com pelo menos 24 horas de antecedência',
      );
    }
  }

  async validateWorkingHours(
    professionalId: string,
    scheduledAt: Date,
    isPsychological: boolean,
  ): Promise<void> {
    const workingHours =
      await this.workingHoursRepository.findByProfessionalId(professionalId);

    if (!workingHours) {
      throw new BadRequestException(
        'Horário de trabalho não configurado para este profissional',
      );
    }

    const dayOfWeek = scheduledAt.getDay(); // 0 = Domingo, 1 = Segunda, etc.
    const timeString = scheduledAt.toTimeString().substring(0, 5); // "HH:MM"

    if (!workingHours.isAvailableAt(timeString, dayOfWeek)) {
      const professionalType = isPsychological ? 'psicólogo' : 'médico';
      throw new BadRequestException(
        `Horário fora do expediente do ${professionalType}. ` +
          `Horário de trabalho: ${workingHours.startTime} às ${workingHours.endTime}, ` +
          `dias: ${this.formatWorkDays(workingHours.workDays)}`,
      );
    }
  }

  async validateAvailability(
    professionalId: string,
    scheduledAt: Date,
  ): Promise<void> {
    const existingAppointment =
      await this.appointmentRepository.findByScheduledAt(
        professionalId,
        scheduledAt,
      );

    if (existingAppointment) {
      throw new BadRequestException(
        'Já existe um agendamento para este profissional neste horário',
      );
    }
  }

  private formatWorkDays(workDays: number[]): string {
    const dayNames = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];
    return workDays.map((day) => dayNames[day]).join(', ');
  }
}
