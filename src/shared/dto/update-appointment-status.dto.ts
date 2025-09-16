import { IsEnum, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../../../generated/prisma';

export class UpdateAppointmentStatusDto {
  @ApiProperty({
    description: 'Status do agendamento',
    enum: AppointmentStatus,
  })
  @IsEnum(AppointmentStatus, {
    message: 'Status deve ser PENDING, CONFIRMED, DECLINED ou CANCELLED',
  })
  @IsNotEmpty({ message: 'Status é obrigatório' })
  status: AppointmentStatus;

  @ApiProperty({ description: 'Motivo do cancelamento', required: false })
  @IsOptional()
  @IsString({ message: 'Motivo do cancelamento deve ser uma string' })
  cancellationReason?: string;
}
