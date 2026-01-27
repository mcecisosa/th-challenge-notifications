import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entity/user.entity';
import { UserRepository } from '../../domain/user.repository';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number, userData: Partial<User>): Promise<User> {
    const userUpdated = await this.userRepository.update(id, userData);
    if (!userUpdated) throw new UserNotFoundError(id);

    return userUpdated;
  }
}
