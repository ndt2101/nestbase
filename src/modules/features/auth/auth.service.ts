import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';
const jwt = require('jsonwebtoken');

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  public async login(loginDto: LoginDto): Promise<any> {
    let user = await this.userService.findByUsername(loginDto.username);
    if (!user || loginDto.password != 'qwe123!@#') {
      throw new UnauthorizedException('Username or password is incorrect');
    }
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        email: user.email
      },
      sub: user.id
    };

    return {
      token: await this.jwtService.signAsync(payload),
      user: user,
    };
  }
}
