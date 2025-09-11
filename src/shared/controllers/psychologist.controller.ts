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
import { PsychologistService } from '../services/psychologist.service';
import { CreatePsychologistDto } from '../dto/create-psychologist.dto';
import { UpdatePsychologistDto } from '../dto/update-psychologist.dto';
import { PsychologistResponseDto } from '../dto/psychologist-response.dto';

@ApiTags('psychologists')
@Controller('psychologists')
export class PsychologistController {
  constructor(private readonly psychologistService: PsychologistService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo psicólogo' })
  @ApiResponse({
    status: 201,
    description: 'Psicólogo criado com sucesso',
    type: PsychologistResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Email, CPF ou CRP já está em uso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async create(
    @Body() createPsychologistDto: CreatePsychologistDto,
  ): Promise<PsychologistResponseDto> {
    return this.psychologistService.create(createPsychologistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os psicólogos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de psicólogos retornada com sucesso',
    type: [PsychologistResponseDto],
  })
  async findAll(): Promise<PsychologistResponseDto[]> {
    return this.psychologistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar psicólogo por ID' })
  @ApiResponse({
    status: 200,
    description: 'Psicólogo encontrado com sucesso',
    type: PsychologistResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Psicólogo não encontrado',
  })
  async findOne(@Param('id') id: string): Promise<PsychologistResponseDto> {
    return this.psychologistService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar psicólogo' })
  @ApiResponse({
    status: 200,
    description: 'Psicólogo atualizado com sucesso',
    type: PsychologistResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Psicólogo não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email, CPF ou CRP já está em uso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async update(
    @Param('id') id: string,
    @Body() updatePsychologistDto: UpdatePsychologistDto,
  ): Promise<PsychologistResponseDto> {
    return this.psychologistService.update(id, updatePsychologistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar psicólogo' })
  @ApiResponse({
    status: 204,
    description: 'Psicólogo deletado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Psicólogo não encontrado',
  })
  async remove(@Param('id') id: string): Promise<void> {
    return this.psychologistService.remove(id);
  }
}
