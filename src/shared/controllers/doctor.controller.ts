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
import { DoctorService } from '../services/doctor.service';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';
import { DoctorResponseDto } from '../dto/doctor-response.dto';

@ApiTags('doctors')
@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo médico' })
  @ApiResponse({
    status: 201,
    description: 'Médico criado com sucesso',
    type: DoctorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email, CPF ou CRM já está em uso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async create(
    @Body() createDoctorDto: CreateDoctorDto,
  ): Promise<DoctorResponseDto> {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os médicos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de médicos retornada com sucesso',
    type: [DoctorResponseDto],
  })
  async findAll(): Promise<DoctorResponseDto[]> {
    return this.doctorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar médico por ID' })
  @ApiResponse({
    status: 200,
    description: 'Médico encontrado com sucesso',
    type: DoctorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Médico não encontrado',
  })
  async findOne(@Param('id') id: string): Promise<DoctorResponseDto> {
    return this.doctorService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar médico' })
  @ApiResponse({
    status: 200,
    description: 'Médico atualizado com sucesso',
    type: DoctorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Médico não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email, CPF ou CRM já está em uso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async update(
    @Param('id') id: string,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<DoctorResponseDto> {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar médico' })
  @ApiResponse({
    status: 204,
    description: 'Médico deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Médico não encontrado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.doctorService.remove(id);
  }
}
