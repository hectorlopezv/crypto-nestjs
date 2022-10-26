import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../models-schemas/user';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private user: Model<User>) {}

  async insertOne(data: Partial<User>) {
    const newUser = new this.user(data);
    return await newUser.save();
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.user.findOne({ email });
  }
}
