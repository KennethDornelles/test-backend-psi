import { Appointment } from '../entities/appointment.entity';
import { AppointmentStatus } from '../entities/appointment.entity';

export interface IAppointmentRepository {
  create(appointment: Appointment): Promise<Appointment>;
  findById(id: string): Promise<Appointment | null>;
  findByPatientId(patientId: string): Promise<Appointment[]>;
  findByPsychologistId(psychologistId: string): Promise<Appointment[]>;
  findByDoctorId(doctorId: string): Promise<Appointment[]>;
  findByProfessionalId(professionalId: string): Promise<Appointment[]>;
  findByScheduledAt(
    professionalId: string,
    scheduledAt: Date,
  ): Promise<Appointment | null>;
  updateStatus(
    id: string,
    status: AppointmentStatus,
    cancellationReason?: string,
  ): Promise<Appointment>;
  update(appointment: Appointment): Promise<Appointment>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Appointment[]>;
}
