import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';
import { ChannelTypes } from '../domain/enums/channel.enum';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'The title of the notification',
    example: 'Hello friend',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the notification',
    example: 'I write you....',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'The channel to send the notification',
    example: ChannelTypes,
  })
  @IsString()
  channel: ChannelTypes;

  @ApiProperty({
    description: 'The destination to send the notification',
  })
  @IsObject()
  payload: unknown;
}
