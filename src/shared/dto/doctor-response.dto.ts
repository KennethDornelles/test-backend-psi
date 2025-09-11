export class DoctorResponseDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf: string;
  crm: string;
  specialty: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<DoctorResponseDto>) {
    Object.assign(this, partial);
  }
}
