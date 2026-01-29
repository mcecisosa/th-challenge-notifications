import { Injectable } from '@nestjs/common';
import { UserNotFoundError } from '../domain/errors/user-not-found.error';
import { UserRepository } from '../infrastructure/user.repository';

@Injectable()
export class DeleteUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<void> {
    const deleted = await this.userRepository.delete(id);

    if (!deleted) throw new UserNotFoundError(id);
  }
}
