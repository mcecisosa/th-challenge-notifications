import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

export class UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getAll(): Promise<User[]> {
    return this.userRepository.find(); //find ya devuelve una promise no necesita await
  }

  findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id }); //find ya devuelve una promise no necesita await
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email }); //find ya devuelve una promise no necesita await
  }

  create(userData: Omit<User, 'id'>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user); //find ya devuelve una promise no necesita await
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    const result = await this.userRepository.update(id, userData);

    if (result.affected === 0) return null;

    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);

    return result.affected !== 0; //distinto de cero retorna true --->se elimino un registro, si es igual a cero retorna false
  }
}
