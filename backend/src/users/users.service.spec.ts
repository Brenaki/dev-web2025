import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { PasswordService } from '../auth/password.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;
  let passwordService: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            users: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      usr_email: 'test@test.com',
      usr_username: 'test',
      usr_password: 'test',
    };
    const hashedPassword = 'hashed_password';
    const mockUser = { ...createUserDto, usr_id: 1, usr_password: hashedPassword };
    
    jest.spyOn(passwordService, 'hashPassword').mockResolvedValue(hashedPassword);
    jest.spyOn(prismaService.users, 'create').mockResolvedValue(mockUser);
    
    const result = await service.create(createUserDto);
    expect(result).toEqual(mockUser);
    expect(passwordService.hashPassword).toHaveBeenCalledWith(createUserDto.usr_password);
    expect(prismaService.users.create).toHaveBeenCalledWith({
      data: { ...createUserDto, usr_password: hashedPassword },
    });
  });

  it('should return all users', async () => {
    const mockUsers = [
      { usr_id: 1, usr_email: 'test@test.com', usr_username: 'test', usr_password: 'hashed' }
    ];
    
    jest.spyOn(prismaService.users, 'findMany').mockResolvedValue(mockUsers);
    
    const result = await service.findAll();
    expect(result).toEqual(mockUsers);
    expect(prismaService.users.findMany).toHaveBeenCalled();
  });
  
  it('should return a user by id', async () => {
    const mockUser = { usr_id: 1, usr_email: 'test@test.com', usr_username: 'test', usr_password: 'hashed' };
    
    jest.spyOn(prismaService.users, 'findUnique').mockResolvedValue(mockUser);
    
    const result = await service.findOne(1);
    expect(result).toEqual(mockUser);
    expect(prismaService.users.findUnique).toHaveBeenCalledWith({
      where: { usr_id: 1 },
    });
  });
  
  it('should update a user', async () => {
    const updateUserDto = {
      usr_email: 'test@test.com',
      usr_username: 'test',
      usr_password: 'test',
    };
    const mockUser = { ...updateUserDto, usr_id: 1, usr_password: 'hashed' };
    
    jest.spyOn(prismaService.users, 'update').mockResolvedValue(mockUser);
    
    const result = await service.update(1, updateUserDto);
    expect(result).toEqual(mockUser);
    expect(prismaService.users.update).toHaveBeenCalledWith({
      where: { usr_id: 1 },
      data: updateUserDto,
    });
  });

  it('should delete a user', async () => {
    const mockUser = { usr_id: 1, usr_email: 'test@test.com', usr_username: 'test', usr_password: 'hashed' };
    
    jest.spyOn(prismaService.users, 'delete').mockResolvedValue(mockUser);
    
    const result = await service.remove(1);
    expect(result).toEqual(mockUser);
    expect(prismaService.users.delete).toHaveBeenCalledWith({
      where: { usr_id: 1 },
    });
  });
});
