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
import { AppointmentService } from '../services/appointment.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { UpdateAppointmentStatusDto } from '../dto/update-appointment-status.dto';
import { AppointmentResponseDto } from '../dto/appointment-response.dto';
import { CreateAppointmentUseCase } from '../../application/use-cases/create-appointment.use-case';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly createAppointmentUseCase: CreateAppointmentUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Criar um novo agendamento (processamento assíncrono)',
  })
  @ApiResponse({
    status: 202,
    description: 'Solicitação de agendamento aceita para processamento',
    schema: {
      type: 'object',
      properties: {
        messageId: { type: 'string' },
        status: { type: 'string', enum: ['ACCEPTED'] },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente ou profissional não encontrado',
  })
  async create(
    @Body() createAppointmentDto: CreateAppointmentDto,
  ): Promise<{ messageId: string; status: string; message: string }> {
    return this.createAppointmentUseCase.execute({
      psychologistId: createAppointmentDto.psychologistId,
      doctorId: createAppointmentDto.doctorId,
      patientId: createAppointmentDto.patientId,
      patientName: createAppointmentDto.patientName,
      patientEmail: createAppointmentDto.patientEmail,
      patientPhone: createAppointmentDto.patientPhone,
      scheduledAt: new Date(createAppointmentDto.scheduledAt),
      duration: createAppointmentDto.duration,
      consultationType: createAppointmentDto.consultationType,
      notes: createAppointmentDto.notes,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os agendamentos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de agendamentos retornada com sucesso',
    type: [AppointmentResponseDto],
  })
  async findAll(): Promise<AppointmentResponseDto[]> {
    return this.appointmentService.findAll();
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Buscar agendamentos por paciente' })
  @ApiResponse({
    status: 200,
    description: 'Lista de agendamentos do paciente retornada com sucesso',
    type: [AppointmentResponseDto],
  })
  async findByPatientId(
    @Param('patientId') patientId: string,
  ): Promise<AppointmentResponseDto[]> {
    return this.appointmentService.findByPatientId(patientId);
  }

  @Get('psychologist/:psychologistId')
  @ApiOperation({ summary: 'Buscar agendamentos por psicólogo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de agendamentos do psicólogo retornada com sucesso',
    type: [AppointmentResponseDto],
  })
  async findByPsychologistId(
    @Param('psychologistId') psychologistId: string,
  ): Promise<AppointmentResponseDto[]> {
    return this.appointmentService.findByPsychologistId(psychologistId);
  }

  @Get('doctor/:doctorId')
  @ApiOperation({ summary: 'Buscar agendamentos por médico' })
  @ApiResponse({
    status: 200,
    description: 'Lista de agendamentos do médico retornada com sucesso',
    type: [AppointmentResponseDto],
  })
  async findByDoctorId(
    @Param('doctorId') doctorId: string,
  ): Promise<AppointmentResponseDto[]> {
    return this.appointmentService.findByDoctorId(doctorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar agendamento por ID' })
  @ApiResponse({
    status: 200,
    description: 'Agendamento encontrado com sucesso',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Agendamento não encontrado',
  })
  async findOne(@Param('id') id: string): Promise<AppointmentResponseDto> {
    return this.appointmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar agendamento' })
  @ApiResponse({
    status: 200,
    description: 'Agendamento atualizado com sucesso',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Agendamento não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou conflito de horário',
  })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do agendamento' })
  @ApiResponse({
    status: 200,
    description: 'Status do agendamento atualizado com sucesso',
    type: AppointmentResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Agendamento não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateAppointmentStatusDto: UpdateAppointmentStatusDto,
  ): Promise<AppointmentResponseDto> {
    return this.appointmentService.updateStatus(id, updateAppointmentStatusDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar agendamento' })
  @ApiResponse({
    status: 204,
    description: 'Agendamento deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Agendamento não encontrado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.appointmentService.remove(id);
  }
}
