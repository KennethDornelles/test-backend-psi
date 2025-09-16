import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { PatientResponseDto } from '../dto/patient-response.dto';

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createPatientDto: CreatePatientDto,
  ): Promise<PatientResponseDto> {
    try {
      // Verificar se o email já existe
      const existingPatientByEmail = await this.prisma.patient.findUnique({
        where: { email: createPatientDto.email },
      });

      if (existingPatientByEmail) {
        throw new ConflictException('Email já está em uso');
      }

      // Verificar se o CPF já existe
      const existingPatientByCpf = await this.prisma.patient.findUnique({
        where: { cpf: createPatientDto.cpf },
      });

      if (existingPatientByCpf) {
        throw new ConflictException('CPF já está em uso');
      }

      const patient = await this.prisma.patient.create({
        data: {
          ...createPatientDto,
          birthDate: createPatientDto.birthDate
            ? new Date(createPatientDto.birthDate)
            : undefined,
        },
      });

      return new PatientResponseDto({
        id: patient.id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone || undefined,
        cpf: patient.cpf,
        birthDate: patient.birthDate || undefined,
        address: patient.address || undefined,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Erro ao criar paciente');
    }
  }

  async findAll(): Promise<PatientResponseDto[]> {
    const patients = await this.prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return patients.map(
      (patient) =>
        new PatientResponseDto({
          id: patient.id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone || undefined,
          cpf: patient.cpf,
          birthDate: patient.birthDate || undefined,
          address: patient.address || undefined,
          createdAt: patient.createdAt,
          updatedAt: patient.updatedAt,
        }),
    );
  }

  async findOne(id: string): Promise<PatientResponseDto> {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }

    return new PatientResponseDto({
      id: patient.id,
      name: patient.name,
      email: patient.email,
      phone: patient.phone || undefined,
      cpf: patient.cpf,
      birthDate: patient.birthDate || undefined,
      address: patient.address || undefined,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.patient.findUnique({
      where: { email },
    });
  }

  async findByCpf(cpf: string) {
    return await this.prisma.patient.findUnique({
      where: { cpf },
    });
  }

  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    try {
      // Verificar se o paciente existe
      const existingPatient = await this.prisma.patient.findUnique({
        where: { id },
      });

      if (!existingPatient) {
        throw new NotFoundException('Paciente não encontrado');
      }

      // Se estiver atualizando o email, verificar se já existe
      if (
        updatePatientDto.email &&
        updatePatientDto.email !== existingPatient.email
      ) {
        const emailExists = await this.prisma.patient.findUnique({
          where: { email: updatePatientDto.email },
        });

        if (emailExists) {
          throw new ConflictException('Email já está em uso');
        }
      }

      // Se estiver atualizando o CPF, verificar se já existe
      if (
        updatePatientDto.cpf &&
        updatePatientDto.cpf !== existingPatient.cpf
      ) {
        const cpfExists = await this.prisma.patient.findUnique({
          where: { cpf: updatePatientDto.cpf },
        });

        if (cpfExists) {
          throw new ConflictException('CPF já está em uso');
        }
      }

      const patient = await this.prisma.patient.update({
        where: { id },
        data: {
          ...updatePatientDto,
          birthDate: updatePatientDto.birthDate
            ? new Date(updatePatientDto.birthDate)
            : undefined,
        },
      });

      return new PatientResponseDto({
        id: patient.id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone || undefined,
        cpf: patient.cpf,
        birthDate: patient.birthDate || undefined,
        address: patient.address || undefined,
        createdAt: patient.createdAt,
        updatedAt: patient.updatedAt,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error('Erro ao atualizar paciente');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const existingPatient = await this.prisma.patient.findUnique({
        where: { id },
      });

      if (!existingPatient) {
        throw new NotFoundException('Paciente não encontrado');
      }

      await this.prisma.patient.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Erro ao deletar paciente');
    }
  }
}
