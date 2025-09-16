import { ApiProperty } from '@nestjs/swagger';

export class WorkingHoursResponseDto {
  @ApiProperty({ description: 'ID único do horário de trabalho' })
  id: string;

  @ApiProperty({ description: 'ID do psicólogo', required: false })
  psychologistId?: string;

  @ApiProperty({ description: 'ID do médico', required: false })
  doctorId?: string;

  @ApiProperty({ description: 'Horário de início (formato HH:MM)' })
  startTime: string;

  @ApiProperty({ description: 'Horário de fim (formato HH:MM)' })
  endTime: string;

  @ApiProperty({
    description: 'Dias de trabalho (1=domingo, 7=sábado)',
    type: [Number],
  })
  workDays: number[];

  @ApiProperty({
    description: 'Início do almoço (formato HH:MM)',
    required: false,
  })
  lunchStart?: string;

  @ApiProperty({
    description: 'Fim do almoço (formato HH:MM)',
    required: false,
  })
  lunchEnd?: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;

  constructor(partial: Partial<WorkingHoursResponseDto>) {
    Object.assign(this, partial);
  }
}
