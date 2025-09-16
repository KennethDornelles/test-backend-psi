export interface IValidationService {
  validatePatientExists(patientId: string): Promise<void>;
  validatePsychologistExists(psychologistId: string): Promise<void>;
  validateDoctorExists(doctorId: string): Promise<void>;
  validateMinimumAntecedence(scheduledAt: Date): Promise<void>;
  validateWorkingHours(
    professionalId: string,
    scheduledAt: Date,
    isPsychological: boolean,
  ): Promise<void>;
  validateAvailability(
    professionalId: string,
    scheduledAt: Date,
  ): Promise<void>;
}
