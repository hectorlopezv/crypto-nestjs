import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserResponse } from 'src/users/dto/response/user-reponse.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LocalStategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<UserResponse> {
    const response = await this.userService.validateUser(username, password);
    console.log('response local', response);
    return { ...response };
  }
}
