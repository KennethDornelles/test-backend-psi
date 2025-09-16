import { ConsultationType } from '../entities/appointment.entity';

export class AppointmentRequest {
  constructor(
    public readonly patientId: string,
    public readonly patientName: string,
    public readonly patientEmail: string,
    public readonly scheduledAt: Date,
    public readonly consultationType: ConsultationType,
    public readonly psychologistId?: string,
    public readonly doctorId?: string,
    public readonly patientPhone?: string,
    public readonly duration: number = 60,
    public readonly notes?: string,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.psychologistId && !this.doctorId) {
      throw new Error('Deve ser especificado um psicólogo ou médico');
    }

    if (this.psychologistId && this.doctorId) {
      throw new Error('Deve ser especificado apenas um profissional');
    }

    if (this.duration < 30 || this.duration > 180) {
      throw new Error('Duração deve estar entre 30 e 180 minutos');
    }

    if (this.scheduledAt <= new Date()) {
      throw new Error('Data de agendamento deve ser futura');
    }
  }

  getProfessionalId(): string {
    return this.psychologistId || this.doctorId || '';
  }

  isPsychological(): boolean {
    return !!this.psychologistId;
  }

  isMedical(): boolean {
    return !!this.doctorId;
  }
}
