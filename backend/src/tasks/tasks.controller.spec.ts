import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

describe('TasksController', () => {
  let controller: TasksController;
  let tasksService: TasksService;

  const mockUser = {
    usr_id: 1,
    usr_email: 'test@example.com',
    usr_username: 'testuser'
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
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

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', async () => {
    const createTaskDto = {
      tks_title: 'Test Task',
      tks_done: false,
      tks_fk_user: 1,
    };
    const mockTask = { ...createTaskDto, tks_id: 1, tks_created_at: new Date(), tks_updated_at: new Date() };
    
    jest.spyOn(tasksService, 'create').mockResolvedValue(mockTask);
    
    const result = await controller.create(createTaskDto, mockUser);
    expect(result).toEqual(mockTask);
    expect(tasksService.create).toHaveBeenCalledWith(createTaskDto);
  });
  
  it('should return all tasks', async () => {
    const mockTasks = [
      { tks_id: 1, tks_title: 'Task 1', tks_done: false, tks_fk_user: 1, tks_created_at: new Date(), tks_updated_at: new Date() }
    ];
    
    jest.spyOn(tasksService, 'findAll').mockResolvedValue(mockTasks);
    
    const result = await controller.findAll(mockUser);
    expect(result).toEqual(mockTasks);
    expect(tasksService.findAll).toHaveBeenCalled();
  });
  
  it('should return a task by id', async () => {
    const mockTask = { tks_id: 1, tks_title: 'Task 1', tks_done: false, tks_fk_user: 1, tks_created_at: new Date(), tks_updated_at: new Date() };
    
    jest.spyOn(tasksService, 'findOne').mockResolvedValue(mockTask);
    
    const result = await controller.findOne('1', mockUser);
    expect(result).toEqual(mockTask);
    expect(tasksService.findOne).toHaveBeenCalledWith(1);
  });
  
  it('should update a task', async () => {
    const updateTaskDto = {
      tks_title: 'Updated Task',
      tks_done: true,
      tks_fk_user: 1,
    };
    const mockTask = { ...updateTaskDto, tks_id: 1, tks_created_at: new Date(), tks_updated_at: new Date() };
    
    jest.spyOn(tasksService, 'update').mockResolvedValue(mockTask);
    
    const result = await controller.update('1', updateTaskDto, mockUser);
    expect(result).toEqual(mockTask);
    expect(tasksService.update).toHaveBeenCalledWith(1, updateTaskDto);
  });
  
  it('should delete a task', async () => {
    const mockTask = { tks_id: 1, tks_title: 'Task 1', tks_done: false, tks_fk_user: 1, tks_created_at: new Date(), tks_updated_at: new Date() };
    
    jest.spyOn(tasksService, 'remove').mockResolvedValue(mockTask);
    
    const result = await controller.remove('1', mockUser);
    expect(result).toEqual(mockTask);
    expect(tasksService.remove).toHaveBeenCalledWith(1);
  });
});
