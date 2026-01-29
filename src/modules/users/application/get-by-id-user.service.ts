import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';
import { UserRepository } from '../infrastructure/user.repository';

@Injectable()
export class getUserByIdService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new UserNotFoundError(id);

    return user;
  }
}
