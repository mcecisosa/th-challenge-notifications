import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/entity/user.entity';
import { UserRepository } from '../domain/user.repository';
import { PokemonClient, PokemonDetails } from 'src/clients/pokemon.client';
import { Repository } from 'typeorm';

export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private pokemonClient: PokemonClient,
  ) {}

  getAll(): Promise<User[]> {
    return this.userRepository.find(); //find ya devuelve una promise no necesita await
  }

  findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id }); //find ya devuelve una promise no necesita await
  }

  async getByIdWithPokemon(
    id: number,
  ): Promise<{ user: User; pokemon: PokemonDetails[] } | null> {
    const user = await this.findById(id);
    if (!user) return null;

    const pokemon = await this.pokemonClient.getPokemonDetailsByIds(
      user.pokemonIds,
    );

    return { user, pokemon };
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

  async addPokemonToUser(id: number, pokemonId: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    //prevent duplicates
    if (!user.pokemonIds.includes(pokemonId)) {
      user.pokemonIds.push(pokemonId);
      return this.userRepository.save(user);
    }
    return user;
  }

  async updatePokemonIds(
    id: number,
    pokemonIds: number[],
  ): Promise<User | null> {
    const result = await this.userRepository.update(id, { pokemonIds });

    if (result.affected === 0) return null;

    return await this.findById(id);
  }

  async removePokemonFromUser(
    id: number,
    pokemonId: number,
  ): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) return null;

    user.pokemonIds = user.pokemonIds.filter((id) => id !== pokemonId);
    await this.userRepository.save(user);

    return user;
  }
}
