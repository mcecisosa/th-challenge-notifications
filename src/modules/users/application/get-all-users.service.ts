import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';
import { UserRepository } from '../infrastructure/user.repository';

@Injectable()
export class GetAllUsersService {
  constructor(private readonly userRepository: UserRepository) {}

  execute(): Promise<User[]> {
    return this.userRepository.getAll();
  }
}
