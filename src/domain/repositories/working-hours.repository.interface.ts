import { WorkingHours } from '../entities/working-hours.entity';

export interface IWorkingHoursRepository {
  findByPsychologistId(psychologistId: string): Promise<WorkingHours | null>;
  findByDoctorId(doctorId: string): Promise<WorkingHours | null>;
  findByProfessionalId(professionalId: string): Promise<WorkingHours | null>;
}
