import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  Matches,
  IsDateString,
} from 'class-validator';

export class CreatePatientDto {
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

  @IsOptional()
  @IsDateString({}, { message: 'Data de nascimento deve ser uma data válida' })
  birthDate?: string;

  @IsOptional()
  @IsString({ message: 'Endereço deve ser uma string' })
  address?: string;
}
