import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { UserRepository } from '../infrastructure/user.repository';
import { CreateUserResponse } from './types/create-user-response.type';
import { PasswordHasher } from 'src/shared/security/password-hasher.abstract';

@Injectable()
export class CreateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(userData: Omit<User, 'id'>): Promise<CreateUserResponse> {
    const hashedPassword = await this.passwordHasher.hash(userData.password);

    const newUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    return { id: newUser.id, username: newUser.username, email: newUser.email };
  }
}
