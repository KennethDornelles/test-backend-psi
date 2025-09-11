export class PsychologistResponseDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf: string;
  crp: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<PsychologistResponseDto>) {
    Object.assign(this, partial);
  }
}
