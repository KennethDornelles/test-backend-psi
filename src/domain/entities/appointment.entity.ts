// Definir os enums localmente para evitar problemas de importação
export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
}

export enum ConsultationType {
  PSYCHOLOGICAL = 'PSYCHOLOGICAL',
  MEDICAL = 'MEDICAL',
}

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly patientId: string,
    public readonly patientName: string,
    public readonly patientEmail: string,
    public readonly scheduledAt: Date,
    public readonly consultationType: ConsultationType,
    public readonly psychologistId?: string,
    public readonly doctorId?: string,
    public readonly patientPhone?: string,
    public readonly duration: number = 60,
    public readonly status: AppointmentStatus = AppointmentStatus.PENDING,
    public readonly notes?: string,
    public readonly cancellationReason?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(data: {
    id?: string;
    psychologistId?: string;
    doctorId?: string;
    patientId: string;
    patientName: string;
    patientEmail: string;
    patientPhone?: string;
    scheduledAt: Date;
    duration?: number;
    consultationType: ConsultationType;
    status?: AppointmentStatus;
    notes?: string;
    cancellationReason?: string;
  }): Appointment {
    return new Appointment(
      data.id || '',
      data.patientId,
      data.patientName,
      data.patientEmail,
      data.scheduledAt,
      data.consultationType,
      data.psychologistId,
      data.doctorId,
      data.patientPhone,
      data.duration || 60,
      data.status || AppointmentStatus.PENDING,
      data.notes,
      data.cancellationReason,
    );
  }

  isConfirmed(): boolean {
    return this.status === AppointmentStatus.CONFIRMED;
  }

  isDeclined(): boolean {
    return this.status === AppointmentStatus.DECLINED;
  }

  isPending(): boolean {
    return this.status === AppointmentStatus.PENDING;
  }

  canBeCancelled(): boolean {
    return (
      this.status === AppointmentStatus.CONFIRMED ||
      this.status === AppointmentStatus.PENDING
    );
  }

  confirm(): Appointment {
    return new Appointment(
      this.id,
      this.patientId,
      this.patientName,
      this.patientEmail,
      this.scheduledAt,
      this.consultationType,
      this.psychologistId,
      this.doctorId,
      this.patientPhone,
      this.duration,
      AppointmentStatus.CONFIRMED,
      this.notes,
      this.cancellationReason,
      this.createdAt,
      new Date(),
    );
  }

  decline(reason?: string): Appointment {
    return new Appointment(
      this.id,
      this.patientId,
      this.patientName,
      this.patientEmail,
      this.scheduledAt,
      this.consultationType,
      this.psychologistId,
      this.doctorId,
      this.patientPhone,
      this.duration,
      AppointmentStatus.DECLINED,
      this.notes,
      reason,
      this.createdAt,
      new Date(),
    );
  }
}
