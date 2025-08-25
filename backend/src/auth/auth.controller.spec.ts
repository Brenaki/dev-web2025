import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return login response when credentials are valid', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      const mockUser = { usr_id: 1, usr_email: 'test@example.com', usr_username: 'testuser' };
      const mockResponse = { access_token: 'token', user: mockUser };

      jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(service, 'login').mockResolvedValue(mockResponse);

      const result = await controller.login(loginDto);

      expect(service.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(service.login).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockResponse);
    });

    it('should throw error when credentials are invalid', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' };

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(controller.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });
});
