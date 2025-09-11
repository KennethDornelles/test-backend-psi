import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../generated/prisma';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsEnum(UserRole, { message: 'Role deve ser PSYCHOLOGIST, DOCTOR ou ADMIN' })
  @IsNotEmpty({ message: 'Role é obrigatória' })
  role: UserRole;
}
