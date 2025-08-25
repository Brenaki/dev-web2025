import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
    return this.prisma.tasks.create({
      data: createTaskDto,
    });
  }

  findAll() {
    return this.prisma.tasks.findMany();
  }

  findOne(id: number) {
    return this.prisma.tasks.findUnique({
      where: {
        tks_id: id,
      },
    });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.prisma.tasks.update({
      where: {
        tks_id: id,
      },
      data: updateTaskDto,
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
