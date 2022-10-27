import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserResponse } from 'src/users/dto/response/user-reponse.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/local/getCurrentUser';
import { LocalAuthGuard } from './guards/local/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserResponse,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send({ ...user });
  }
}
