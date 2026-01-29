import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateNotificationDto {
  @ApiPropertyOptional({ example: 'new title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'new content...' })
  @IsOptional()
  @IsString()
  content?: string;
}
