export class PatientResponseDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf: string;
  birthDate?: Date;
  address?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<PatientResponseDto>) {
    Object.assign(this, partial);
  }
}
