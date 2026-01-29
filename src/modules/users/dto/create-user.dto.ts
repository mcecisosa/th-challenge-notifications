import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

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
}
