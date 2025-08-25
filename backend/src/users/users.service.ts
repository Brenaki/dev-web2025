import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import { PasswordService } from '../auth/password.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.passwordService.hashPassword(createUserDto.usr_password);

    return this.prisma.users.create({
      data: {
        ...createUserDto,
        usr_password: hashedPassword,
      },
    });
  }

  findAll() {
    return this.prisma.users.findMany();
  }

  findOne(id: number) {
    return this.prisma.users.findUnique({
      where: {
        usr_id: id,
      },
    });
  }

  findByEmail(email: string) {
    return this.prisma.users.findUnique({
      where: {
        usr_email: email,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.users.update({
      where: {
        usr_id: id,
      },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.users.delete({
      where: {
        usr_id: id,
      },
    });
  }
}
