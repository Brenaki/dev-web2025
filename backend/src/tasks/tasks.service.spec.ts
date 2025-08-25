import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: {
            tasks: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a task', async () => {
    const createTaskDto = {
      tks_title: 'Test Task',
      tks_done: false,
      tks_fk_user: 1,
    };
    const mockTask = { ...createTaskDto, tks_id: 1, tks_created_at: new Date(), tks_updated_at: new Date() };
    
    jest.spyOn(prismaService.tasks, 'create').mockResolvedValue(mockTask);
    
    const result = await service.create(createTaskDto);
    expect(result).toEqual(mockTask);
    expect(prismaService.tasks.create).toHaveBeenCalledWith({ data: createTaskDto });
  });

  it('should return all tasks', async () => {
    const mockTasks = [
      { tks_id: 1, tks_title: 'Task 1', tks_done: false, tks_fk_user: 1, tks_created_at: new Date(), tks_updated_at: new Date() }
    ];
    
    jest.spyOn(prismaService.tasks, 'findMany').mockResolvedValue(mockTasks);
    
    const result = await service.findAll();
    expect(result).toEqual(mockTasks);
    expect(prismaService.tasks.findMany).toHaveBeenCalled();
  });

  it('should return a task by id', async () => {
    const mockTask = { tks_id: 1, tks_title: 'Task 1', tks_done: false, tks_fk_user: 1, tks_created_at: new Date(), tks_updated_at: new Date() };
    
    jest.spyOn(prismaService.tasks, 'findUnique').mockResolvedValue(mockTask);
    
    const result = await service.findOne(1);
    expect(result).toEqual(mockTask);
    expect(prismaService.tasks.findUnique).toHaveBeenCalledWith({
      where: { tks_id: 1 },
    });
  });

  it('should update a task', async () => {
    const updateTaskDto = {
      tks_title: 'Updated Task',
      tks_done: true,
      tks_fk_user: 1,
    };
    const mockTask = { ...updateTaskDto, tks_id: 1, tks_created_at: new Date(), tks_updated_at: new Date() };
    
    jest.spyOn(prismaService.tasks, 'update').mockResolvedValue(mockTask);
    
    const result = await service.update(1, updateTaskDto);
    expect(result).toEqual(mockTask);
    expect(prismaService.tasks.update).toHaveBeenCalledWith({
      where: { tks_id: 1 },
      data: updateTaskDto,
    });
  });

  it('should delete a task', async () => {
    const mockTask = { tks_id: 1, tks_title: 'Task 1', tks_done: false, tks_fk_user: 1, tks_created_at: new Date(), tks_updated_at: new Date() };
    
    jest.spyOn(prismaService.tasks, 'delete').mockResolvedValue(mockTask);
    
    const result = await service.remove(1);
    expect(result).toEqual(mockTask);
    expect(prismaService.tasks.delete).toHaveBeenCalledWith({
      where: { tks_id: 1 },
    });
  });
});
