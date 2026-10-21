import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { PrismaService } from '../src/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// ── Mocked PrismaService ─────────────────────────────────
const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  passwordHash: '',
  firstName: 'Test',
  lastName: 'User',
  role: 'CLIENT',
};

const mockPrisma = {
  user: {
    create: vi.fn(),
    findUnique: vi.fn(),
  },
};

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    // Pre-hash a password so findUnique can return a valid hash
    mockUser.passwordHash = await bcrypt.hash('password123', 10);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: { sign: () => 'signed-jwt-token' } },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  afterAll(() => vi.clearAllMocks());

  it('registers a new user and returns a token', async () => {
    mockPrisma.user.create.mockResolvedValueOnce(mockUser);
    const result = await service.register({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    });
    expect(result.user.email).toBe('test@example.com');
    expect(result.token).toBe('signed-jwt-token');
  });

  it('logs in with correct credentials and returns a token', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
    const result = await service.login({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.token).toBe('signed-jwt-token');
  });

  it('throws UnauthorizedException on wrong password', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(mockUser);
    await expect(
      service.login({ email: 'test@example.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException if user does not exist', async () => {
    mockPrisma.user.findUnique.mockResolvedValueOnce(null);
    await expect(
      service.login({ email: 'ghost@example.com', password: 'any' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
