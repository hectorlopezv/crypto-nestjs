import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';

import { CreateUserRequest } from './dto/request/create-user-request.dto';
import { UserResponse } from './dto/response/user-reponse.dto';
import { CoinbaseAuth } from './models-schemas/coinbase';
import { User } from './models-schemas/user';
import { UserRepository } from './repositories/user-repository';
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async createUser(createUser: CreateUserRequest): Promise<UserResponse> {
    await this.ValidateCreateUserRequest(createUser);

    const user = await this.userRepository.insertOne({
      ...createUser,
      password: await argon2.hash(createUser.password),
    });

    return this.buildResponse(user);
  }

  async findOneById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOneById(id);
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
      isCoinbaseAuthorized: !!user.coinbaseAuth,
    };
  }
  async updateUser(userId: string, data: Partial<User>): Promise<UserResponse> {
    const user = await this.userRepository.updateOne(userId, data);
    if (!user) {
      throw new NotFoundException(`User not found by _id: '${userId}'.`);
    }
    return this.buildResponse(user);
  }
  async validateUser(email: string, password: string): Promise<UserResponse> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const passwordIsValid = await argon2.verify(user.password, password);

    if (!passwordIsValid) {
      throw new BadRequestException('credentials Invalid');
    }
    return this.buildResponse(user);
  }
  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return this.buildResponse(user);
  }
  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userRepository.getAllUsers();
    return users.map((user) => this.buildResponse(user));
  }

  async getCoinbaseAuth(userId: string): Promise<CoinbaseAuth> {
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User not found by _id: '${userId}'.`);
    }
    if (!user.coinbaseAuth) {
      throw new UnauthorizedException(
        `User with _id: '${userId}' has not authorized Coinbase.`,
      );
    }
    return user.coinbaseAuth;
  }
}
