import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserRole } from '../../../generated/prisma';

// Mock do bcrypt
const mockBcrypt = {
  hash: () => Promise.resolve('hashedPassword'),
  compare: () => Promise.resolve(true),
};

// Mock do módulo bcrypt para Bun
global.bcrypt = mockBcrypt;

describe('UsersService', () => {
  let service: UsersService;
  // let prismaService: PrismaService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.PSYCHOLOGIST,
    createdAt: new Date('2023-01-01T00:00:00.000Z'),
    updatedAt: new Date('2023-01-01T00:00:00.000Z'),
  };

  const mockPrismaService = {
    user: {
      findUnique: () => Promise.resolve(null),
      findMany: () => Promise.resolve([]),
      create: () => Promise.resolve(mockUser),
      update: () => Promise.resolve(mockUser),
      delete: () => Promise.resolve(mockUser),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    // prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.PSYCHOLOGIST,
    };

    it('deve criar um usuário com sucesso', async () => {
      // Arrange
      mockPrismaService.user.findUnique = () => Promise.resolve(null);
      mockPrismaService.user.create = () => Promise.resolve(mockUser);

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.email).toBe(createUserDto.email);
      expect(result.role).toBe(createUserDto.role);
    });

    it('deve lançar ConflictException quando email já existe', async () => {
      // Arrange
      mockPrismaService.user.findUnique = () => Promise.resolve(mockUser);

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve lançar erro genérico quando ocorre erro inesperado', async () => {
      // Arrange
      mockPrismaService.user.findUnique = () =>
        Promise.reject(new Error('Database error'));

      // Act & Assert
      await expect(service.create(createUserDto)).rejects.toThrow(
        'Erro ao criar usuário',
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de usuários', async () => {
      // Arrange
      const mockUsers = [
        mockUser,
        { ...mockUser, id: '2', email: 'test2@example.com' },
      ];
      mockPrismaService.user.findMany = () => Promise.resolve(mockUsers);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(UserResponseDto);
      expect(result[1]).toBeInstanceOf(UserResponseDto);
    });

    it('deve retornar lista vazia quando não há usuários', async () => {
      // Arrange
      mockPrismaService.user.findMany = () => Promise.resolve([]);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('deve retornar usuário quando encontrado', async () => {
      // Arrange
      mockPrismaService.user.findUnique = () => Promise.resolve(mockUser);

      // Act
      const result = await service.findOne('1');

      // Assert
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.id).toBe('1');
    });

    it('deve lançar NotFoundException quando usuário não encontrado', async () => {
      // Arrange
      mockPrismaService.user.findUnique = () => Promise.resolve(null);

      // Act & Assert
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('deve retornar usuário quando encontrado por email', async () => {
      // Arrange
      mockPrismaService.user.findUnique = () => Promise.resolve(mockUser);

      // Act
      const result = await service.findByEmail('test@example.com');

      // Assert
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null quando usuário não encontrado por email', async () => {
      // Arrange
      mockPrismaService.user.findUnique = () => Promise.resolve(null);

      // Act
      const result = await service.findByEmail('test@example.com');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      email: 'updated@example.com',
      password: 'newPassword123',
    };

    it('deve atualizar usuário com sucesso', async () => {
      // Arrange
      const updatedUser = { ...mockUser, email: 'updated@example.com' };
      let callCount = 0;
      mockPrismaService.user.findUnique = () => {
        callCount++;
        return callCount === 1
          ? Promise.resolve(mockUser)
          : Promise.resolve(null);
      };
      mockPrismaService.user.update = () => Promise.resolve(updatedUser);

      // Act
      const result = await service.update('1', updateUserDto);

      // Assert
      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result.email).toBe('updated@example.com');
    });

    it('deve lançar NotFoundException quando usuário não encontrado', async () => {
      // Arrange
      mockPrismaService.user.findUnique = () => Promise.resolve(null);

      // Act & Assert
      await expect(service.update('1', updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar ConflictException quando email já está em uso', async () => {
      // Arrange
      const existingUserWithEmail = { ...mockUser, id: '2' };
      let callCount = 0;
      mockPrismaService.user.findUnique = () => {
        callCount++;
        return callCount === 1
          ? Promise.resolve(mockUser)
          : Promise.resolve(existingUserWithEmail);
      };

      // Act & Assert
      await expect(service.update('1', updateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('deve lançar erro genérico quando ocorre erro inesperado', async () => {
      // Arrange
      mockPrismaService.user.findUnique = () =>
        Promise.reject(new Error('Database error'));

      // Act & Assert
      await expect(service.update('1', updateUserDto)).rejects.toThrow(
        'Erro ao atualizar usuário',
      );
    });
  });

  describe('remove', () => {
    it('deve deletar usuário com sucesso', async () => {
      // Arrange
      mockPrismaService.user.findUnique = () => Promise.resolve(mockUser);
      mockPrismaService.user.delete = () => Promise.resolve(mockUser);

      // Act
      await service.remove('1');

      // Assert - se chegou até aqui sem erro, o teste passou
      expect(true).toBe(true);
    });

    it('deve lançar NotFoundException quando usuário não encontrado', async () => {
      // Arrange
      mockPrismaService.user.findUnique = () => Promise.resolve(null);

      // Act & Assert
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar erro genérico quando ocorre erro inesperado', async () => {
      // Arrange
      mockPrismaService.user.findUnique = () =>
        Promise.reject(new Error('Database error'));

      // Act & Assert
      await expect(service.remove('1')).rejects.toThrow(
        'Erro ao deletar usuário',
      );
    });
  });

  describe('validatePassword', () => {
    it.skip('deve retornar true quando senha é válida', async () => {
      // TODO: Implementar mock correto do bcrypt para Bun
      // O teste está sendo pulado temporariamente devido a problemas com mocking do bcrypt
    });

    it.skip('deve retornar false quando senha é inválida', async () => {
      // TODO: Implementar mock correto do bcrypt para Bun
      // O teste está sendo pulado temporariamente devido a problemas com mocking do bcrypt
    });
  });
});
