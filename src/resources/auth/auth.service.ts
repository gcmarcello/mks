import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/signup.dto';
import { compareHash } from '../../utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findOne({
      where: { email: signInDto.email },
      select: ['id', 'email', 'password', 'role'],
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    const isPasswordValid = await compareHash(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, username: user.name, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const user = await this.userService.create(signUpDto);
    return {
      access_token: await this.jwtService.signAsync({
        sub: user.id,
        username: user.name,
        role: user.role,
      }),
    };
  }
}
