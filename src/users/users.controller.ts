import { Body, Controller, Post } from '@nestjs/common';
import { hash } from 'bcrypt';
import { CreateUserRequest } from './dto/request/create-user-request.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async createUser(@Body() createUser: CreateUserRequest) {
    return this.usersService.createUser({
      ...createUser,
      password: await hash(createUser.password, 10),
    });
  }
}
