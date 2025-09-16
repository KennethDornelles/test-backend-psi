export interface INotificationService {
  sendAppointmentConfirmation(
    patientEmail: string,
    patientName: string,
    scheduledAt: Date,
    professionalType: string,
  ): Promise<void>;

  sendAppointmentDecline(
    patientEmail: string,
    patientName: string,
    scheduledAt: Date,
    reason: string,
  ): Promise<void>;
}
