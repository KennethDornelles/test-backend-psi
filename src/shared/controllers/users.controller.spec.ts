import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserRole } from '../../../generated/prisma';

describe('UsersController', () => {
  let controller: UsersController;
  // let usersService: UsersService;

  const mockUserResponse: UserResponseDto = {
    id: '1',
    email: 'test@example.com',
    role: UserRole.PSYCHOLOGIST,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  };

  const mockUsersService = {
    create: () => Promise.resolve(mockUserResponse),
    findAll: () => Promise.resolve([]),
    findOne: () => Promise.resolve(mockUserResponse),
    update: () => Promise.resolve(mockUserResponse),
    remove: () => Promise.resolve(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    // usersService = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.PSYCHOLOGIST,
    };

    it('deve criar um usuário com sucesso', async () => {
      // Arrange
      mockUsersService.create = () => Promise.resolve(mockUserResponse);

      // Act
      const result = await controller.create(createUserDto);

      // Assert
      expect(result).toEqual(mockUserResponse);
    });

    it('deve lançar ConflictException quando email já está em uso', async () => {
      // Arrange
      mockUsersService.create = () =>
        Promise.reject(new ConflictException('Email já está em uso'));

      // Act & Assert
      await expect(controller.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve lançar erro quando dados são inválidos', async () => {
      // Arrange
      const invalidDto = { ...createUserDto, email: 'invalid-email' };
      mockUsersService.create = () =>
        Promise.reject(new Error('Dados inválidos'));

      // Act & Assert
      await expect(controller.create(invalidDto)).rejects.toThrow(
        'Dados inválidos',
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de usuários', async () => {
      // Arrange
      const mockUsers = [
        mockUserResponse,
        { ...mockUserResponse, id: '2', email: 'test2@example.com' },
      ];
      mockUsersService.findAll = () => Promise.resolve(mockUsers);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('deve retornar lista vazia quando não há usuários', async () => {
      // Arrange
      mockUsersService.findAll = () => Promise.resolve([]);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('deve retornar usuário quando encontrado', async () => {
      // Arrange
      mockUsersService.findOne = () => Promise.resolve(mockUserResponse);

      // Act
      const result = await controller.findOne('1');

      // Assert
      expect(result).toEqual(mockUserResponse);
    });

    it('deve lançar NotFoundException quando usuário não encontrado', async () => {
      // Arrange
      mockUsersService.findOne = () =>
        Promise.reject(new NotFoundException('Usuário não encontrado'));

      // Act & Assert
      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      email: 'updated@example.com',
      password: 'newPassword123',
    };

    it('deve atualizar usuário com sucesso', async () => {
      // Arrange
      const updatedUser = { ...mockUserResponse, email: 'updated@example.com' };
      mockUsersService.update = () => Promise.resolve(updatedUser);

      // Act
      const result = await controller.update('1', updateUserDto);

      // Assert
      expect(result).toEqual(updatedUser);
    });

    it('deve lançar NotFoundException quando usuário não encontrado', async () => {
      // Arrange
      mockUsersService.update = () =>
        Promise.reject(new NotFoundException('Usuário não encontrado'));

      // Act & Assert
      await expect(controller.update('1', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar ConflictException quando email já está em uso', async () => {
      // Arrange
      mockUsersService.update = () =>
        Promise.reject(new ConflictException('Email já está em uso'));

      // Act & Assert
      await expect(controller.update('1', updateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve lançar erro quando dados são inválidos', async () => {
      // Arrange
      const invalidDto = { ...updateUserDto, email: 'invalid-email' };
      mockUsersService.update = () =>
        Promise.reject(new Error('Dados inválidos'));

      // Act & Assert
      await expect(controller.update('1', invalidDto)).rejects.toThrow(
        'Dados inválidos',
      );
    });
  });

  describe('remove', () => {
    it('deve deletar usuário com sucesso', async () => {
      // Arrange
      mockUsersService.remove = () => Promise.resolve(undefined);

      // Act
      const result = await controller.remove('1');

      // Assert
      expect(result).toBeUndefined();
    });

    it('deve lançar NotFoundException quando usuário não encontrado', async () => {
      // Arrange
      mockUsersService.remove = () =>
        Promise.reject(new NotFoundException('Usuário não encontrado'));

      // Act & Assert
      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar erro genérico quando ocorre erro inesperado', async () => {
      // Arrange
      mockUsersService.remove = () =>
        Promise.reject(new Error('Erro ao deletar usuário'));

      // Act & Assert
      await expect(controller.remove('1')).rejects.toThrow(
        'Erro ao deletar usuário',
      );
    });
  });
});
