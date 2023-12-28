import { Injectable } from '@nestjs/common';

import { User } from '../models';

@Injectable()
export class UsersService {
  async findOne(name: string): Promise<User> {
    return User.findOneBy({ name });
  }

  async createOne(user: User): Promise<User> {
    return user.save();
  }
}
