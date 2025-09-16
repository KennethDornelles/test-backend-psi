import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsInt,
  Min,
  Max,
  Matches,
  ValidateIf,
} from 'class-validator';

export class CreateWorkingHoursDto {
  @IsOptional()
  @IsString({ message: 'ID do psicólogo deve ser uma string' })
  psychologistId?: string;

  @IsOptional()
  @IsString({ message: 'ID do médico deve ser uma string' })
  doctorId?: string;

  @IsString({ message: 'Horário de início deve ser uma string' })
  @IsNotEmpty({ message: 'Horário de início é obrigatório' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Horário de início deve estar no formato HH:MM',
  })
  startTime: string;

  @IsString({ message: 'Horário de fim deve ser uma string' })
  @IsNotEmpty({ message: 'Horário de fim é obrigatório' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Horário de fim deve estar no formato HH:MM',
  })
  endTime: string;

  @IsArray({ message: 'Dias de trabalho deve ser um array' })
  @IsNotEmpty({ message: 'Dias de trabalho é obrigatório' })
  @IsInt({ each: true, message: 'Cada dia deve ser um número inteiro' })
  @Min(1, {
    each: true,
    message: 'Dias devem ser entre 1 (domingo) e 7 (sábado)',
  })
  @Max(7, {
    each: true,
    message: 'Dias devem ser entre 1 (domingo) e 7 (sábado)',
  })
  workDays: number[];

  @IsOptional()
  @IsString({ message: 'Início do almoço deve ser uma string' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Início do almoço deve estar no formato HH:MM',
  })
  lunchStart?: string;

  @IsOptional()
  @IsString({ message: 'Fim do almoço deve ser uma string' })
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Fim do almoço deve estar no formato HH:MM',
  })
  @ValidateIf((o: CreateWorkingHoursDto) => !!o.lunchStart)
  lunchEnd?: string;
}
