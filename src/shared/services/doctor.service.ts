import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';
import { DoctorResponseDto } from '../dto/doctor-response.dto';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<DoctorResponseDto> {
    try {
      // Verificar se o email já existe
      const existingDoctorByEmail = await this.prisma.doctor.findUnique({
        where: { email: createDoctorDto.email },
      });

      if (existingDoctorByEmail) {
        throw new ConflictException('Email já está em uso');
      }

      // Verificar se o CPF já existe
      const existingDoctorByCpf = await this.prisma.doctor.findUnique({
        where: { cpf: createDoctorDto.cpf },
      });

      if (existingDoctorByCpf) {
        throw new ConflictException('CPF já está em uso');
      }

      // Verificar se o CRM já existe
      const existingDoctorByCrm = await this.prisma.doctor.findUnique({
        where: { crm: createDoctorDto.crm },
      });

      if (existingDoctorByCrm) {
        throw new ConflictException('CRM já está em uso');
      }

      const doctor = await this.prisma.doctor.create({
        data: createDoctorDto,
      });

      return new DoctorResponseDto({
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone || undefined,
        cpf: doctor.cpf,
        crm: doctor.crm,
        specialty: doctor.specialty,
        createdAt: doctor.createdAt,
        updatedAt: doctor.updatedAt,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Erro ao criar médico');
    }
  }

  async findAll(): Promise<DoctorResponseDto[]> {
    const doctors = await this.prisma.doctor.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return doctors.map(
      (doctor) =>
        new DoctorResponseDto({
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
          phone: doctor.phone || undefined,
          cpf: doctor.cpf,
          crm: doctor.crm,
          specialty: doctor.specialty,
          createdAt: doctor.createdAt,
          updatedAt: doctor.updatedAt,
        }),
    );
  }

  async findOne(id: string): Promise<DoctorResponseDto> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Médico não encontrado');
    }

    return new DoctorResponseDto({
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone || undefined,
      cpf: doctor.cpf,
      crm: doctor.crm,
      specialty: doctor.specialty,
      createdAt: doctor.createdAt,
      updatedAt: doctor.updatedAt,
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.doctor.findUnique({
      where: { email },
    });
  }

  async findByCpf(cpf: string) {
    return await this.prisma.doctor.findUnique({
      where: { cpf },
    });
  }

  async findByCrm(crm: string) {
    return await this.prisma.doctor.findUnique({
      where: { crm },
    });
  }

  async update(
    id: string,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<DoctorResponseDto> {
    try {
      // Verificar se o médico existe
      const existingDoctor = await this.prisma.doctor.findUnique({
        where: { id },
      });

      if (!existingDoctor) {
        throw new NotFoundException('Médico não encontrado');
      }

      // Se estiver atualizando o email, verificar se já existe
      if (
        updateDoctorDto.email &&
        updateDoctorDto.email !== existingDoctor.email
      ) {
        const emailExists = await this.prisma.doctor.findUnique({
          where: { email: updateDoctorDto.email },
        });

        if (emailExists) {
          throw new ConflictException('Email já está em uso');
        }
      }

      // Se estiver atualizando o CPF, verificar se já existe
      if (updateDoctorDto.cpf && updateDoctorDto.cpf !== existingDoctor.cpf) {
        const cpfExists = await this.prisma.doctor.findUnique({
          where: { cpf: updateDoctorDto.cpf },
        });

        if (cpfExists) {
          throw new ConflictException('CPF já está em uso');
        }
      }

      // Se estiver atualizando o CRM, verificar se já existe
      if (updateDoctorDto.crm && updateDoctorDto.crm !== existingDoctor.crm) {
        const crmExists = await this.prisma.doctor.findUnique({
          where: { crm: updateDoctorDto.crm },
        });

        if (crmExists) {
          throw new ConflictException('CRM já está em uso');
        }
      }

      const doctor = await this.prisma.doctor.update({
        where: { id },
        data: updateDoctorDto,
      });

      return new DoctorResponseDto({
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        phone: doctor.phone || undefined,
        cpf: doctor.cpf,
        crm: doctor.crm,
        specialty: doctor.specialty,
        createdAt: doctor.createdAt,
        updatedAt: doctor.updatedAt,
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new Error('Erro ao atualizar médico');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const existingDoctor = await this.prisma.doctor.findUnique({
        where: { id },
      });

      if (!existingDoctor) {
        throw new NotFoundException('Médico não encontrado');
      }

      await this.prisma.doctor.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Erro ao deletar médico');
    }
  }
}
