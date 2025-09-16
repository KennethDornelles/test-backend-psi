import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IAppointmentRepository } from '../../domain/repositories/appointment.repository.interface';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../domain/entities/appointment.entity';

@Injectable()
export class PrismaAppointmentRepository implements IAppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(appointment: Appointment): Promise<Appointment> {
    const created = await this.prisma.appointment.create({
      data: {
        id: appointment.id,
        psychologistId: appointment.psychologistId,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        patientPhone: appointment.patientPhone,
        scheduledAt: appointment.scheduledAt,
        duration: appointment.duration,
        consultationType: appointment.consultationType as any,
        status: appointment.status as any,
        notes: appointment.notes,
        cancellationReason: appointment.cancellationReason,
      },
    });

    return this.mapToEntity(created);
  }

  async findById(id: string): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
    });

    return appointment ? this.mapToEntity(appointment) : null;
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { patientId },
      orderBy: { scheduledAt: 'asc' },
    });

    return appointments.map((appointment) => this.mapToEntity(appointment));
  }

  async findByPsychologistId(psychologistId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { psychologistId },
      orderBy: { scheduledAt: 'asc' },
    });

    return appointments.map((appointment) => this.mapToEntity(appointment));
  }

  async findByDoctorId(doctorId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId },
      orderBy: { scheduledAt: 'asc' },
    });

    return appointments.map((appointment) => this.mapToEntity(appointment));
  }

  async findByProfessionalId(professionalId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        OR: [{ psychologistId: professionalId }, { doctorId: professionalId }],
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return appointments.map((appointment) => this.mapToEntity(appointment));
  }

  async findByScheduledAt(
    professionalId: string,
    scheduledAt: Date,
  ): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findFirst({
      where: {
        OR: [{ psychologistId: professionalId }, { doctorId: professionalId }],
        scheduledAt,
      },
    });

    return appointment ? this.mapToEntity(appointment) : null;
  }

  async updateStatus(
    id: string,
    status: AppointmentStatus,
    cancellationReason?: string,
  ): Promise<Appointment> {
    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        status: status as any,
        cancellationReason,
        updatedAt: new Date(),
      },
    });

    return this.mapToEntity(updated);
  }

  async update(appointment: Appointment): Promise<Appointment> {
    const updated = await this.prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        psychologistId: appointment.psychologistId,
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        patientEmail: appointment.patientEmail,
        patientPhone: appointment.patientPhone,
        scheduledAt: appointment.scheduledAt,
        duration: appointment.duration,
        consultationType: appointment.consultationType as any,
        status: appointment.status as any,
        notes: appointment.notes,
        cancellationReason: appointment.cancellationReason,
        updatedAt: new Date(),
      },
    });

    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.appointment.delete({
      where: { id },
    });
  }

  async findAll(): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      orderBy: { scheduledAt: 'asc' },
    });

    return appointments.map((appointment) => this.mapToEntity(appointment));
  }

  private mapToEntity(data: any): Appointment {
    return Appointment.create({
      id: data.id,
      psychologistId: data.psychologistId,
      doctorId: data.doctorId,
      patientId: data.patientId,
      patientName: data.patientName,
      patientEmail: data.patientEmail,
      patientPhone: data.patientPhone,
      scheduledAt: data.scheduledAt,
      duration: data.duration,
      consultationType: data.consultationType,
      status: data.status,
      notes: data.notes,
      cancellationReason: data.cancellationReason,
    });
  }
}
