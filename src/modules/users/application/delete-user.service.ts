import { Injectable } from '@nestjs/common';
import { UserRepository } from '../infrastructure/user.repository';
import { EntityNotFoundError } from 'src/shared/errors/not-found.error';

@Injectable()
export class DeleteUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<void> {
    const deleted = await this.userRepository.delete(id);

    if (!deleted) throw new EntityNotFoundError('User', id);
  }
}
