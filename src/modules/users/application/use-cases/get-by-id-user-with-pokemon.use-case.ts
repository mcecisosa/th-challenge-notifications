import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/user.repository';
import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import { UserWithPokemonResponseDto } from '../../dto/user-with-pokemon-response.dto';

@Injectable()
export class GetUserByIdWithPokemonUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: number): Promise<UserWithPokemonResponseDto> {
    const result = await this.userRepository.getByIdWithPokemon(id);
    if (!result) throw new UserNotFoundError(id);

    return {
      id: result.user.id,
      username: result.user.username,
      email: result.user.email,
      pokemonIds: result.user.pokemonIds,
      pokemon: result.pokemon,
    };
  }
}
