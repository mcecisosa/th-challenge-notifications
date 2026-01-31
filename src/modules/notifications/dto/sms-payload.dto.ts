import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class SmsPayloadDto {
  @ApiProperty({ example: '+5491123456789' })
  @IsString()
  @MaxLength(20)
  phoneNumber: string;
}
