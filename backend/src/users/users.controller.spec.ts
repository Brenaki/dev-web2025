import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      usr_email: 'test@test.com',
      usr_username: 'test',
      usr_password: 'test',
    };
    const mockUser = { ...createUserDto, usr_id: 1 };
    
    jest.spyOn(usersService, 'create').mockResolvedValue(mockUser);
    
    const result = await controller.create(createUserDto);
    expect(result).toEqual(mockUser);
    expect(usersService.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should return all users', async () => {
    const mockUsers = [
      { usr_id: 1, usr_email: 'test@test.com', usr_username: 'test', usr_password: 'hashed' }
    ];
    
    jest.spyOn(usersService, 'findAll').mockResolvedValue(mockUsers);
    
    const result = await controller.findAll();
    expect(result).toEqual(mockUsers);
    expect(usersService.findAll).toHaveBeenCalled();
  });
  
  it('should return a user by id', async () => {
    const mockUser = { usr_id: 1, usr_email: 'test@test.com', usr_username: 'test', usr_password: 'hashed' };
    
    jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
    
    const result = await controller.findOne('1');
    expect(result).toEqual(mockUser);
    expect(usersService.findOne).toHaveBeenCalledWith(1);
  });
  
  it('should update a user', async () => {
    const updateUserDto = {
      usr_email: 'test@test.com',
      usr_username: 'test',
      usr_password: 'test',
    };
    const mockUser = { ...updateUserDto, usr_id: 1 };
    
    jest.spyOn(usersService, 'update').mockResolvedValue(mockUser);
    
    const result = await controller.update('1', updateUserDto);
    expect(result).toEqual(mockUser);
    expect(usersService.update).toHaveBeenCalledWith(1, updateUserDto);
  });

  it('should delete a user', async () => {
    const mockUser = { usr_id: 1, usr_email: 'test@test.com', usr_username: 'test', usr_password: 'hashed' };
    
    jest.spyOn(usersService, 'remove').mockResolvedValue(mockUser);
    
    const result = await controller.remove('1');
    expect(result).toEqual(mockUser);
    expect(usersService.remove).toHaveBeenCalledWith(1);
  });
});
