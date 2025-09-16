import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus, ConsultationType } from '../../../generated/prisma';

export class AppointmentResponseDto {
  @ApiProperty({ description: 'ID único do agendamento' })
  id: string;

  @ApiProperty({ description: 'ID do psicólogo', required: false })
  psychologistId?: string;

  @ApiProperty({ description: 'ID do médico', required: false })
  doctorId?: string;

  @ApiProperty({ description: 'ID do paciente' })
  patientId: string;

  @ApiProperty({ description: 'Nome do paciente no momento do agendamento' })
  patientName: string;

  @ApiProperty({ description: 'Email do paciente no momento do agendamento' })
  patientEmail: string;

  @ApiProperty({
    description: 'Telefone do paciente no momento do agendamento',
    required: false,
  })
  patientPhone?: string;

  @ApiProperty({ description: 'Data e hora do agendamento' })
  scheduledAt: Date;

  @ApiProperty({ description: 'Duração em minutos' })
  duration: number;

  @ApiProperty({ description: 'Tipo de consulta', enum: ConsultationType })
  consultationType: ConsultationType;

  @ApiProperty({
    description: 'Status do agendamento',
    enum: AppointmentStatus,
  })
  status: AppointmentStatus;

  @ApiProperty({ description: 'Observações do profissional', required: false })
  notes?: string;

  @ApiProperty({ description: 'Motivo do cancelamento', required: false })
  cancellationReason?: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;

  constructor(partial: Partial<AppointmentResponseDto>) {
    Object.assign(this, partial);
  }
}
