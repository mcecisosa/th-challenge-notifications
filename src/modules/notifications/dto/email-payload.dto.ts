import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class EmailPayloadDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;
}
