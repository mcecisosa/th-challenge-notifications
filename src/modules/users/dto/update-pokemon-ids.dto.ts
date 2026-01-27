import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class UpdatePokemonIdsDto {
  @ApiProperty({
    description: 'List of Pokemon IDs owned by the user',
    example: [1, 4, 7],
    type: [Number],
  })
  @IsArray()
  @IsInt({ each: true })
  pokemonIds: number[];
}
