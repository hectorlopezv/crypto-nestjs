import { BadRequestException, Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { CreateUserRequest } from './dto/request/create-user-request.dto';
import { UserResponse } from './dto/response/user-reponse.dto';
import { User } from './models-schemas/user';
import { UserRepository } from './repositories/user-repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async createUser(createUser: CreateUserRequest): Promise<UserResponse> {
    await this.ValidateCreateUserRequest(createUser);
    const user = await this.userRepository.insertOne({
      ...createUser,
      password: await hash(createUser.password, 10),
    });

    return this.buildResponse(user);
  }

  private async ValidateCreateUserRequest(
    createUser: CreateUserRequest,
  ): Promise<void> {
    const user = await this.userRepository.findOneByEmail(createUser.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }
  }

  private buildResponse(user: User): UserResponse {
    return {
      _id: user._id.toHexString(),
      email: user.email,
    };
  }
}
