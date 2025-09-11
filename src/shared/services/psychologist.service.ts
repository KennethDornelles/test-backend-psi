import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePsychologistDto } from '../dto/create-psychologist.dto';
import { UpdatePsychologistDto } from '../dto/update-psychologist.dto';
import { PsychologistResponseDto } from '../dto/psychologist-response.dto';

@Injectable()
export class PsychologistService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createPsychologistDto: CreatePsychologistDto,
  ): Promise<PsychologistResponseDto> {
    try {
      // Verificar se o email já existe
      const existingPsychologistByEmail =
        await this.prisma.psychologist.findUnique({
          where: { email: createPsychologistDto.email },
        });

      if (existingPsychologistByEmail) {
        throw new ConflictException('Email já está em uso');
      }

      // Verificar se o CPF já existe
      const existingPsychologistByCpf =
        await this.prisma.psychologist.findUnique({
          where: { cpf: createPsychologistDto.cpf },
        });

      if (existingPsychologistByCpf) {
        throw new ConflictException('CPF já está em uso');
      }

      // Verificar se o CRP já existe
      const existingPsychologistByCrp =
        await this.prisma.psychologist.findUnique({
          where: { crp: createPsychologistDto.crp },
        });

      if (existingPsychologistByCrp) {
        throw new ConflictException('CRP já está em uso');
      }

      const psychologist = await this.prisma.psychologist.create({
        data: createPsychologistDto,
      });

      return new PsychologistResponseDto({
        id: psychologist.id,
        name: psychologist.name,
        email: psychologist.email,
        phone: psychologist.phone || undefined,
        cpf: psychologist.cpf,
        crp: psychologist.crp,
        createdAt: psychologist.createdAt,
        updatedAt: psychologist.updatedAt,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Erro ao criar psicólogo');
    }
  }

  async findAll(): Promise<PsychologistResponseDto[]> {
    const psychologists = await this.prisma.psychologist.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return psychologists.map(
      (psychologist) =>
        new PsychologistResponseDto({
          id: psychologist.id,
          name: psychologist.name,
          email: psychologist.email,
          phone: psychologist.phone || undefined,
          cpf: psychologist.cpf,
          crp: psychologist.crp,
          createdAt: psychologist.createdAt,
          updatedAt: psychologist.updatedAt,
        }),
    );
  }

  async findOne(id: string): Promise<PsychologistResponseDto> {
    const psychologist = await this.prisma.psychologist.findUnique({
      where: { id },
    });

    if (!psychologist) {
      throw new NotFoundException('Psicólogo não encontrado');
    }

    return new PsychologistResponseDto({
      id: psychologist.id,
      name: psychologist.name,
      email: psychologist.email,
      phone: psychologist.phone || undefined,
      cpf: psychologist.cpf,
      crp: psychologist.crp,
      createdAt: psychologist.createdAt,
      updatedAt: psychologist.updatedAt,
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.psychologist.findUnique({
      where: { email },
    });
  }

  async findByCpf(cpf: string) {
    return await this.prisma.psychologist.findUnique({
      where: { cpf },
    });
  }

  async findByCrp(crp: string) {
    return await this.prisma.psychologist.findUnique({
      where: { crp },
    });
  }

  async update(
    id: string,
    updatePsychologistDto: UpdatePsychologistDto,
  ): Promise<PsychologistResponseDto> {
    try {
      // Verificar se o psicólogo existe
      const existingPsychologist = await this.prisma.psychologist.findUnique({
        where: { id },
      });

      if (!existingPsychologist) {
        throw new NotFoundException('Psicólogo não encontrado');
      }

      // Se estiver atualizando o email, verificar se já existe
      if (
        updatePsychologistDto.email &&
        updatePsychologistDto.email !== existingPsychologist.email
      ) {
        const emailExists = await this.prisma.psychologist.findUnique({
          where: { email: updatePsychologistDto.email },
        });

        if (emailExists) {
          throw new ConflictException('Email já está em uso');
        }
      }

      // Se estiver atualizando o CPF, verificar se já existe
      if (
        updatePsychologistDto.cpf &&
        updatePsychologistDto.cpf !== existingPsychologist.cpf
      ) {
        const cpfExists = await this.prisma.psychologist.findUnique({
          where: { cpf: updatePsychologistDto.cpf },
        });

        if (cpfExists) {
          throw new ConflictException('CPF já está em uso');
        }
      }

      // Se estiver atualizando o CRP, verificar se já existe
      if (
        updatePsychologistDto.crp &&
        updatePsychologistDto.crp !== existingPsychologist.crp
      ) {
        const crpExists = await this.prisma.psychologist.findUnique({
          where: { crp: updatePsychologistDto.crp },
        });

        if (crpExists) {
          throw new ConflictException('CRP já está em uso');
        }
      }

      const psychologist = await this.prisma.psychologist.update({
        where: { id },
        data: updatePsychologistDto,
      });

      return new PsychologistResponseDto({
        id: psychologist.id,
        name: psychologist.name,
        email: psychologist.email,
        phone: psychologist.phone || undefined,
        cpf: psychologist.cpf,
        crp: psychologist.crp,
        createdAt: psychologist.createdAt,
        updatedAt: psychologist.updatedAt,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error('Erro ao atualizar psicólogo');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const existingPsychologist = await this.prisma.psychologist.findUnique({
        where: { id },
      });

      if (!existingPsychologist) {
        throw new NotFoundException('Psicólogo não encontrado');
      }

      await this.prisma.psychologist.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Erro ao deletar psicólogo');
    }
  }
}
