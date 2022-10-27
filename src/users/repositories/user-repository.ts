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
  async getAllUsers(): Promise<User[]> {
    return await this.user.find();
  }

  async findOneById(id: string): Promise<User> {
    console.log('id', id);
    return await this.user.findById({ _id: id });
  }

  async updateOne(userId: string, data: Partial<User>): Promise<User> {
    return this.user.findByIdAndUpdate(userId, data, { new: true });
  }
}
