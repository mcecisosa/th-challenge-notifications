import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { UserRepository } from '../infrastructure/user.repository';
import { EntityNotFoundError } from 'src/shared/errors/not-found.error';

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number, userData: Partial<User>): Promise<User> {
    const userUpdated = await this.userRepository.update(id, userData);
    if (!userUpdated) throw new EntityNotFoundError('User', id);

    return userUpdated;
  }
}
