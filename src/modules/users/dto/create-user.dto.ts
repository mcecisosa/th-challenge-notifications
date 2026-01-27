import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The username of the user', example: 'Juan' })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'juan@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'List of Pokemon IDs owned by the user',
    example: [1, 4, 7],
    type: [Number],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  pokemonIds?: number[];
}

//Nest solo acepta propiedades que tengan decoradores
//Swagger (@ApiProperty) NO cuenta
//El tipo TS (number[]) NO cuenta
//Para class-validator, pokemonIds no existe, aunque esté en la clase. (si no tiene decoradores de nest)
//Por eso el ValidationPipe dice: "property pokemonIds should not exist"
