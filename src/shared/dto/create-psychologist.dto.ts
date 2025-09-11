import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreatePsychologistDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsOptional()
  @IsString({ message: 'Telefone deve ser uma string' })
  phone?: string;

  @IsString({ message: 'CPF é obrigatório' })
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, {
    message: 'CPF deve estar no formato 000.000.000-00',
  })
  cpf: string;

  @IsString({ message: 'CRP é obrigatório' })
  @IsNotEmpty({ message: 'CRP é obrigatório' })
  @Matches(/^\d{2}\/\d{6}$/, {
    message: 'CRP deve estar no formato 00/000000',
  })
  crp: string;
}
