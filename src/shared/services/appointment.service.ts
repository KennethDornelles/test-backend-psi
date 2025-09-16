import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { UpdateAppointmentStatusDto } from '../dto/update-appointment-status.dto';
import { AppointmentResponseDto } from '../dto/appointment-response.dto';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    try {
      // Validar que pelo menos um profissional foi especificado
      if (
        !createAppointmentDto.psychologistId &&
        !createAppointmentDto.doctorId
      ) {
        throw new BadRequestException(
          'Deve ser especificado um psicólogo ou médico',
        );
      }

      // Validar que não foram especificados ambos
      if (
        createAppointmentDto.psychologistId &&
        createAppointmentDto.doctorId
      ) {
        throw new BadRequestException(
          'Deve ser especificado apenas um profissional',
        );
      }

      // Verificar se o paciente existe
      const patient = await this.prisma.patient.findUnique({
        where: { id: createAppointmentDto.patientId },
      });
      if (!patient) {
        throw new NotFoundException('Paciente não encontrado');
      }

      // Verificar se o profissional existe
      if (createAppointmentDto.psychologistId) {
        const psychologist = await this.prisma.psychologist.findUnique({
          where: { id: createAppointmentDto.psychologistId },
        });
        if (!psychologist) {
          throw new NotFoundException('Psicólogo não encontrado');
        }
      }

      if (createAppointmentDto.doctorId) {
        const doctor = await this.prisma.doctor.findUnique({
          where: { id: createAppointmentDto.doctorId },
        });
        if (!doctor) {
          throw new NotFoundException('Médico não encontrado');
        }
      }

      // Verificar se já existe agendamento no mesmo horário para o profissional
      const scheduledAt = new Date(createAppointmentDto.scheduledAt);
      const existingAppointment = await this.prisma.appointment.findFirst({
        where: {
          OR: [
            { psychologistId: createAppointmentDto.psychologistId },
            { doctorId: createAppointmentDto.doctorId },
          ],
          scheduledAt: scheduledAt,
        },
      });

      if (existingAppointment) {
        throw new ConflictException(
          'Já existe um agendamento para este profissional neste horário',
        );
      }

      const appointment = await this.prisma.appointment.create({
        data: {
          ...createAppointmentDto,
          scheduledAt: scheduledAt,
          duration: createAppointmentDto.duration || 60,
        },
      });

      return new AppointmentResponseDto({
        id: appointment.id,
        psychologistId: appointment.psychologistId || undefined,
        doctorId: appointment.doctorId || undefined,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        patientPhone: appointment.patientPhone || undefined,
        scheduledAt: appointment.scheduledAt,
        duration: appointment.duration,
        consultationType: appointment.consultationType,
        status: appointment.status,
        notes: appointment.notes || undefined,
        cancellationReason: appointment.cancellationReason || undefined,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new Error('Erro ao criar agendamento');
    }
  }

  async findAll(): Promise<AppointmentResponseDto[]> {
    const appointments = await this.prisma.appointment.findMany({
      orderBy: { scheduledAt: 'asc' },
      include: {
        psychologist: {
          select: { id: true, name: true, email: true },
        },
        doctor: {
          select: { id: true, name: true, email: true },
        },
        patient: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return appointments.map(
      (appointment) =>
        new AppointmentResponseDto({
          id: appointment.id,
          psychologistId: appointment.psychologistId || undefined,
          doctorId: appointment.doctorId || undefined,
          patientId: appointment.patientId,
          patientName: appointment.patientName,
          patientEmail: appointment.patientEmail,
          patientPhone: appointment.patientPhone || undefined,
          scheduledAt: appointment.scheduledAt,
          duration: appointment.duration,
          consultationType: appointment.consultationType,
          status: appointment.status,
          notes: appointment.notes || undefined,
          cancellationReason: appointment.cancellationReason || undefined,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt,
        }),
    );
  }

  async findOne(id: string): Promise<AppointmentResponseDto> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: {
        psychologist: {
          select: { id: true, name: true, email: true },
        },
        doctor: {
          select: { id: true, name: true, email: true },
        },
        patient: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Agendamento não encontrado');
    }

    return new AppointmentResponseDto({
      id: appointment.id,
      psychologistId: appointment.psychologistId || undefined,
      doctorId: appointment.doctorId || undefined,
      patientId: appointment.patientId,
      patientName: appointment.patientName,
      patientEmail: appointment.patientEmail,
      patientPhone: appointment.patientPhone || undefined,
      scheduledAt: appointment.scheduledAt,
      duration: appointment.duration,
      consultationType: appointment.consultationType,
      status: appointment.status,
      notes: appointment.notes || undefined,
      cancellationReason: appointment.cancellationReason || undefined,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    });
  }

  async findByPatientId(patientId: string): Promise<AppointmentResponseDto[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { patientId },
      orderBy: { scheduledAt: 'asc' },
    });

    return appointments.map(
      (appointment) =>
        new AppointmentResponseDto({
          id: appointment.id,
          psychologistId: appointment.psychologistId || undefined,
          doctorId: appointment.doctorId || undefined,
          patientId: appointment.patientId,
          patientName: appointment.patientName,
          patientEmail: appointment.patientEmail,
          patientPhone: appointment.patientPhone || undefined,
          scheduledAt: appointment.scheduledAt,
          duration: appointment.duration,
          consultationType: appointment.consultationType,
          status: appointment.status,
          notes: appointment.notes || undefined,
          cancellationReason: appointment.cancellationReason || undefined,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt,
        }),
    );
  }

  async findByPsychologistId(
    psychologistId: string,
  ): Promise<AppointmentResponseDto[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { psychologistId },
      orderBy: { scheduledAt: 'asc' },
    });

    return appointments.map(
      (appointment) =>
        new AppointmentResponseDto({
          id: appointment.id,
          psychologistId: appointment.psychologistId || undefined,
          doctorId: appointment.doctorId || undefined,
          patientId: appointment.patientId,
          patientName: appointment.patientName,
          patientEmail: appointment.patientEmail,
          patientPhone: appointment.patientPhone || undefined,
          scheduledAt: appointment.scheduledAt,
          duration: appointment.duration,
          consultationType: appointment.consultationType,
          status: appointment.status,
          notes: appointment.notes || undefined,
          cancellationReason: appointment.cancellationReason || undefined,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt,
        }),
    );
  }

  async findByDoctorId(doctorId: string): Promise<AppointmentResponseDto[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId },
      orderBy: { scheduledAt: 'asc' },
    });

    return appointments.map(
      (appointment) =>
        new AppointmentResponseDto({
          id: appointment.id,
          psychologistId: appointment.psychologistId || undefined,
          doctorId: appointment.doctorId || undefined,
          patientId: appointment.patientId,
          patientName: appointment.patientName,
          patientEmail: appointment.patientEmail,
          patientPhone: appointment.patientPhone || undefined,
          scheduledAt: appointment.scheduledAt,
          duration: appointment.duration,
          consultationType: appointment.consultationType,
          status: appointment.status,
          notes: appointment.notes || undefined,
          cancellationReason: appointment.cancellationReason || undefined,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt,
        }),
    );
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    try {
      // Verificar se o agendamento existe
      const existingAppointment = await this.prisma.appointment.findUnique({
        where: { id },
      });

      if (!existingAppointment) {
        throw new NotFoundException('Agendamento não encontrado');
      }

      // Se estiver atualizando a data/hora, verificar conflitos
      if (updateAppointmentDto.scheduledAt) {
        const scheduledAt = new Date(updateAppointmentDto.scheduledAt);
        const existingAppointmentAtTime =
          await this.prisma.appointment.findFirst({
            where: {
              OR: [
                {
                  psychologistId:
                    updateAppointmentDto.psychologistId ||
                    existingAppointment.psychologistId,
                },
                {
                  doctorId:
                    updateAppointmentDto.doctorId ||
                    existingAppointment.doctorId,
                },
              ],
              scheduledAt: scheduledAt,
              id: { not: id },
            },
          });

        if (existingAppointmentAtTime) {
          throw new ConflictException(
            'Já existe um agendamento para este profissional neste horário',
          );
        }
      }

      const appointment = await this.prisma.appointment.update({
        where: { id },
        data: {
          ...updateAppointmentDto,
          scheduledAt: updateAppointmentDto.scheduledAt
            ? new Date(updateAppointmentDto.scheduledAt)
            : undefined,
        },
      });

      return new AppointmentResponseDto({
        id: appointment.id,
        psychologistId: appointment.psychologistId || undefined,
        doctorId: appointment.doctorId || undefined,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        patientPhone: appointment.patientPhone || undefined,
        scheduledAt: appointment.scheduledAt,
        duration: appointment.duration,
        consultationType: appointment.consultationType,
        status: appointment.status,
        notes: appointment.notes || undefined,
        cancellationReason: appointment.cancellationReason || undefined,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error('Erro ao atualizar agendamento');
    }
  }

  async updateStatus(
    id: string,
    updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ): Promise<AppointmentResponseDto> {
    try {
      // Verificar se o agendamento existe
      const existingAppointment = await this.prisma.appointment.findUnique({
        where: { id },
      });

      if (!existingAppointment) {
        throw new NotFoundException('Agendamento não encontrado');
      }

      const appointment = await this.prisma.appointment.update({
        where: { id },
        data: {
          status: updateAppointmentStatusDto.status,
          cancellationReason:
            updateAppointmentStatusDto.cancellationReason || null,
        },
      });

      return new AppointmentResponseDto({
        id: appointment.id,
        psychologistId: appointment.psychologistId || undefined,
        doctorId: appointment.doctorId || undefined,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        patientPhone: appointment.patientPhone || undefined,
        scheduledAt: appointment.scheduledAt,
        duration: appointment.duration,
        consultationType: appointment.consultationType,
        status: appointment.status,
        notes: appointment.notes || undefined,
        cancellationReason: appointment.cancellationReason || undefined,
        createdAt: appointment.createdAt,
        updatedAt: appointment.updatedAt,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Erro ao atualizar status do agendamento');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const existingAppointment = await this.prisma.appointment.findUnique({
        where: { id },
      });

      if (!existingAppointment) {
        throw new NotFoundException('Agendamento não encontrado');
      }

      await this.prisma.appointment.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Erro ao deletar agendamento');
    }
  }
}
