import { Injectable } from '@nestjs/common';
import { User } from '../../domain/entity/user.entity';
import { UserRepository } from '../../domain/user.repository';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userData: Omit<User, 'id'>): Promise<User> {
    const newUser = await this.userRepository.create(userData);

    return newUser;
  }
}
