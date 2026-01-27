import { ApiProperty } from '@nestjs/swagger';
import { User } from '../domain/entity/user.entity';

export class UserResponseDto {
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
    example: [1, 4, 7],
    type: [Number],
  })
  pokemonIds: number[];

  static fromEntity(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      pokemonIds: user.pokemonIds,
    };
  }
}
