import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PushPayloadDto {
  @ApiProperty({ example: 'device-token-123' })
  @IsString()
  deviceToken: string;
}
