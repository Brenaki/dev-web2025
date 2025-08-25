import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let passwordService: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            comparePassword: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'correctpassword';
      const hashedPassword = 'hashed_password';
      const mockUser = {
        usr_id: 1,
        usr_email: email,
        usr_username: 'testuser',
        usr_password: hashedPassword,
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(passwordService, 'comparePassword').mockResolvedValue(true);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(passwordService.comparePassword).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toEqual({
        usr_id: 1,
        usr_email: email,
        usr_username: 'testuser',
      });
    });

    it('should return null when user is not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password';

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const hashedPassword = 'hashed_password';
      const mockUser = {
        usr_id: 1,
        usr_email: email,
        usr_username: 'testuser',
        usr_password: hashedPassword,
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser);
      jest.spyOn(passwordService, 'comparePassword').mockResolvedValue(false);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(passwordService.comparePassword).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data', async () => {
      const mockUser = {
        usr_id: 1,
        usr_email: 'test@example.com',
        usr_username: 'testuser',
      };
      const mockToken = 'jwt-token';

      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await service.login(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockUser.usr_email,
        sub: mockUser.usr_id,
        username: mockUser.usr_username,
      });
      expect(result.access_token).toBe(mockToken);
      expect(result.user).toEqual({
        id: mockUser.usr_id,
        email: mockUser.usr_email,
        username: mockUser.usr_username,
      });
    });
  });

  describe('verifyToken', () => {
    it('should verify token correctly', async () => {
      const token = 'valid-token';
      const payload = { sub: 1, email: 'test@example.com' };

      jest.spyOn(jwtService, 'verify').mockReturnValue(payload);

      const result = await service.verifyToken(token);

      expect(jwtService.verify).toHaveBeenCalledWith(token);
      expect(result).toEqual(payload);
    });
  });
});
