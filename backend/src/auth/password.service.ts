import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { authConfig } from './config/auth.config';

@Injectable()
export class PasswordService {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, authConfig.bcrypt.saltRounds);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
