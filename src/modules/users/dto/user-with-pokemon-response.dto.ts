import { ApiProperty } from '@nestjs/swagger';
import { User } from '../domain/entity/user.entity';
import { PokemonDetails } from 'src/clients/pokemon.client';

export class UserWithPokemonResponseDto {
  @ApiProperty({ description: 'The unique identifier of the user', example: 1 })
  id: number;

  @ApiProperty({ description: 'The username of the user', example: 'Juan' })
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'juan@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'List of Pokemon IDs owned by the user',
    example: [1, 4, 7],
    type: [Number],
  })
  pokemonIds: number[];

  @ApiProperty({
    description: 'Details of Pokemon owned by the user',
    example: [
      { id: 1, name: 'bulbasaur' },
      { id: 4, name: 'charmander' },
      { id: 7, name: 'squirtle' },
    ],
    type: 'array',
  })
  pokemon: PokemonDetails[];

  static fromEntity(
    user: User,
    pokemon: PokemonDetails[],
  ): UserWithPokemonResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      pokemonIds: user.pokemonIds,
      pokemon: pokemon,
    };
  }
}
