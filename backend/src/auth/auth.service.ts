import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private passwordService: PasswordService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await this.passwordService.comparePassword(password, user.usr_password)) {
      const { usr_password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.usr_email, 
      sub: user.usr_id,
      username: user.usr_username 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        usr_id: user.usr_id,
        usr_email: user.usr_email,
        usr_username: user.usr_username,
        usr_created_at: user.usr_created_at,
        usr_updated_at: user.usr_updated_at,
      },
    };
  }

  async verifyToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
