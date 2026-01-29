import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';
import { UserRepository } from '../infrastructure/user.repository';

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number, userData: Partial<User>): Promise<User> {
    const userUpdated = await this.userRepository.update(id, userData);
    if (!userUpdated) throw new UserNotFoundError(id);

    return userUpdated;
  }
}
