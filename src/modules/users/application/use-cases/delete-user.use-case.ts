import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<void> {
    const deleted = await this.userRepository.delete(id);

    if (!deleted) throw new UserNotFoundError(id);
  }
}
