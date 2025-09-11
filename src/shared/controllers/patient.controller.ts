import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatientService } from '../services/patient.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { PatientResponseDto } from '../dto/patient-response.dto';

@ApiTags('patients')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo paciente' })
  @ApiResponse({
    status: 201,
    description: 'Paciente criado com sucesso',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email ou CPF já está em uso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async create(
    @Body() createPatientDto: CreatePatientDto,
  ): Promise<PatientResponseDto> {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os pacientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pacientes retornada com sucesso',
    type: [PatientResponseDto],
  })
  async findAll(): Promise<PatientResponseDto[]> {
    return this.patientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar paciente por ID' })
  @ApiResponse({
    status: 200,
    description: 'Paciente encontrado com sucesso',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente não encontrado',
  })
  async findOne(@Param('id') id: string): Promise<PatientResponseDto> {
    return this.patientService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar paciente' })
  @ApiResponse({
    status: 200,
    description: 'Paciente atualizado com sucesso',
    type: PatientResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email ou CPF já está em uso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<PatientResponseDto> {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar paciente' })
  @ApiResponse({
    status: 204,
    description: 'Paciente deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente não encontrado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.patientService.remove(id);
  }
}
