import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserResponse } from 'src/users/dto/response/user-reponse.dto';
import { UsersService } from 'src/users/users.service';
interface TokenPayload {
  userId: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  async login(user: UserResponse, response: Response) {
    console.log('user', user);
    const tokenPayload: TokenPayload = { userId: user._id };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION_TIME'),
    );
    const token = this.jwtService.sign(tokenPayload);
    response.cookie('Authentication', token, { httpOnly: true, expires });
  }
}
