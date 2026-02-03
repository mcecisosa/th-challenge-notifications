import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { UserRepository } from '../infrastructure/user.repository';
import { EntityNotFoundError } from 'src/shared/errors/not-found.error';

@Injectable()
export class getUserByIdService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) throw new EntityNotFoundError('User', id);

    return user;
  }
}
