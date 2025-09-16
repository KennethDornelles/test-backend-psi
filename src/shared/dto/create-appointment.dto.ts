import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsDateString,
  IsEmail,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConsultationType } from '../../../generated/prisma';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'ID do psicólogo', required: false })
  @IsOptional()
  @IsString({ message: 'ID do psicólogo deve ser uma string' })
  psychologistId?: string;

  @ApiProperty({ description: 'ID do médico', required: false })
  @IsOptional()
  @IsString({ message: 'ID do médico deve ser uma string' })
  doctorId?: string;

  @ApiProperty({ description: 'ID do paciente' })
  @IsString({ message: 'ID do paciente deve ser uma string' })
  @IsNotEmpty({ message: 'ID do paciente é obrigatório' })
  patientId: string;

  @ApiProperty({ description: 'Nome do paciente no momento do agendamento' })
  @IsString({ message: 'Nome do paciente deve ser uma string' })
  @IsNotEmpty({ message: 'Nome do paciente é obrigatório' })
  patientName: string;

  @ApiProperty({ description: 'Email do paciente no momento do agendamento' })
  @IsEmail({}, { message: 'Email do paciente deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email do paciente é obrigatório' })
  patientEmail: string;

  @ApiProperty({
    description: 'Telefone do paciente no momento do agendamento',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Telefone do paciente deve ser uma string' })
  @Matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, {
    message: 'Telefone deve estar no formato (XX) XXXXX-XXXX ou (XX) XXXX-XXXX',
  })
  patientPhone?: string;

  @ApiProperty({ description: 'Data e hora do agendamento' })
  @IsDateString({}, { message: 'Data do agendamento deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data do agendamento é obrigatória' })
  scheduledAt: string;

  @ApiProperty({ description: 'Duração em minutos', default: 60 })
  @IsOptional()
  @IsInt({ message: 'Duração deve ser um número inteiro' })
  @Min(15, { message: 'Duração mínima é 15 minutos' })
  duration?: number;

  @ApiProperty({ description: 'Tipo de consulta', enum: ConsultationType })
  @IsEnum(ConsultationType, {
    message: 'Tipo de consulta deve ser PSYCHOLOGICAL ou MEDICAL',
  })
  @IsNotEmpty({ message: 'Tipo de consulta é obrigatório' })
  consultationType: ConsultationType;

  @ApiProperty({ description: 'Observações do profissional', required: false })
  @IsOptional()
  @IsString({ message: 'Observações devem ser uma string' })
  notes?: string;
}
