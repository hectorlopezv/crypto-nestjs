import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CurrentUser } from 'src/auth/decorators/local/getCurrentUser';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';
import { UserResponse } from 'src/users/dto/response/user-reponse.dto';
import { CoinbaseAuthService } from './coinbase-auth.service';
import { CoinbaseService } from './coinbase.service';

@Controller('coinbase')
export class CoinbaseController {
  constructor(
    private readonly coinbaseAuthService: CoinbaseAuthService,
    private readonly coinbaseService: CoinbaseService,
  ) {}
  @Get('auth')
  @UseGuards(JwtAuthGuard)
  authorize(@Res() response: Response): void {
    return this.coinbaseAuthService.authorize(response);
  }

  @Get('auth/callback')
  @UseGuards(JwtAuthGuard)
  handleCallback(@Req() request: Request, @Res() response: Response): void {
    return this.coinbaseAuthService.handleCallback(request, response);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getCoinbaseData(@CurrentUser() user: UserResponse): Promise<any> {
    return this.coinbaseService.getPrimaryAccountTransactions(user._id);
  }
}
