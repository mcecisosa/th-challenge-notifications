import { PokemonDetails } from 'src/clients/pokemon.client';
import { User } from './entity/user.entity';

export abstract class UserRepository {
  abstract getAll(): Promise<User[]>;

  abstract findById(id: number): Promise<User | null>;

  abstract getByIdWithPokemon(
    id: number,
  ): Promise<{ user: User; pokemon: PokemonDetails[] } | null>;

  abstract create(userData: Omit<User, 'id'>): Promise<User>;

  abstract update(id: number, userData: Partial<User>): Promise<User | null>;

  abstract delete(id: number): Promise<boolean>;

  abstract addPokemonToUser(
    id: number,
    pokemonId: number,
  ): Promise<User | null>;

  abstract updatePokemonIds(
    id: number,
    pokemonIds: number[],
  ): Promise<User | null>;

  abstract removePokemonFromUser(
    id: number,
    pokemonId: number,
  ): Promise<User | null>;
}
