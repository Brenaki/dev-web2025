import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
    const { subtasks, ...taskData } = createTaskDto as any;
    return this.prisma.tasks.create({
      data: {
        ...taskData,
        subtasks: subtasks && subtasks.length
          ? {
              create: subtasks.map((s: any) => ({
                stb_title: s.stb_title,
                stb_done: !!s.stb_done,
              })),
            }
          : undefined,
      },
      include: { subtasks: true },
    });
  }

  findAll() {
    return this.prisma.tasks.findMany({
      include: { subtasks: true },
      orderBy: [
        { tks_priority: 'desc' },
        { tks_created_at: 'desc' },
      ],
    });
  }

  findOne(id: number) {
    return this.prisma.tasks.findUnique({
      where: { tks_id: id },
      include: { subtasks: true },
    });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    const { subtasks, ...taskData } = updateTaskDto as any;
    return this.prisma.tasks.update({
      where: { tks_id: id },
      data: {
        ...taskData,
        ...(Array.isArray(subtasks)
          ? {
              subtasks: {
                deleteMany: {},
                create: subtasks.map((s: any) => ({
                  stb_title: s.stb_title,
                  stb_done: !!s.stb_done,
                })),
              },
            }
          : {}),
      },
      include: { subtasks: true },
    });
  }

  remove(id: number) {
    return this.prisma.tasks.delete({
      where: {
        tks_id: id,
      },
    });
  }
}
