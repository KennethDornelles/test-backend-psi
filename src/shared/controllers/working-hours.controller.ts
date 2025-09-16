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
import { WorkingHoursService } from '../services/working-hours.service';
import { CreateWorkingHoursDto } from '../dto/create-working-hours.dto';
import { UpdateWorkingHoursDto } from '../dto/update-working-hours.dto';
import { WorkingHoursResponseDto } from '../dto/working-hours-response.dto';

@ApiTags('working-hours')
@Controller('working-hours')
export class WorkingHoursController {
  constructor(private readonly workingHoursService: WorkingHoursService) {}

  @Post()
  @ApiOperation({ summary: 'Criar horários de trabalho' })
  @ApiResponse({
    status: 201,
    description: 'Horários de trabalho criados com sucesso',
    type: WorkingHoursResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou profissional já possui horários',
  })
  @ApiResponse({
    status: 404,
    description: 'Profissional não encontrado',
  })
  async create(
    @Body() createWorkingHoursDto: CreateWorkingHoursDto,
  ): Promise<WorkingHoursResponseDto> {
    return this.workingHoursService.create(createWorkingHoursDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os horários de trabalho' })
  @ApiResponse({
    status: 200,
    description: 'Lista de horários de trabalho retornada com sucesso',
    type: [WorkingHoursResponseDto],
  })
  async findAll(): Promise<WorkingHoursResponseDto[]> {
    return this.workingHoursService.findAll();
  }

  @Get('psychologist/:psychologistId')
  @ApiOperation({ summary: 'Buscar horários de trabalho por psicólogo' })
  @ApiResponse({
    status: 200,
    description: 'Horários de trabalho encontrados com sucesso',
    type: WorkingHoursResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Horários de trabalho não encontrados',
  })
  async findByPsychologistId(
    @Param('psychologistId') psychologistId: string,
  ): Promise<WorkingHoursResponseDto | null> {
    return this.workingHoursService.findByPsychologistId(psychologistId);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Buscar horários de trabalho por médico' })
  @ApiResponse({
    status: 200,
    description: 'Horários de trabalho encontrados com sucesso',
    type: WorkingHoursResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Horários de trabalho não encontrados',
  })
  async findByDoctorId(
    @Param('doctorId') doctorId: string,
  ): Promise<WorkingHoursResponseDto | null> {
    return this.workingHoursService.findByDoctorId(doctorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar horários de trabalho por ID' })
  @ApiResponse({
    status: 200,
    description: 'Horários de trabalho encontrados com sucesso',
    type: WorkingHoursResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Horários de trabalho não encontrados',
  })
  async findOne(@Param('id') id: string): Promise<WorkingHoursResponseDto> {
    return this.workingHoursService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar horários de trabalho' })
  @ApiResponse({
    status: 200,
    description: 'Horários de trabalho atualizados com sucesso',
    type: WorkingHoursResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Horários de trabalho não encontrados',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async update(
    @Param('id') id: string,
    @Body() updateWorkingHoursDto: UpdateWorkingHoursDto,
  ): Promise<WorkingHoursResponseDto> {
    return this.workingHoursService.update(id, updateWorkingHoursDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar horários de trabalho' })
  @ApiResponse({
    status: 204,
    description: 'Horários de trabalho deletados com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Horários de trabalho não encontrados',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.workingHoursService.remove(id);
  }
}
