import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';
import { ChannelTypes } from '../domain/enums/channel.enum';
import { EmailPayloadDto } from './email-payload.dto';
import { SmsPayloadDto } from './sms-payload.dto';
import { PushPayloadDto } from './push-payload.dto';

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
    enum: ChannelTypes,
    example: ChannelTypes.EMAIL,
    description: 'The channel to send the notification',
  })
  //@IsEnum(ChannelTypes)
  @IsString()
  channel: ChannelTypes;

  @ApiProperty({
    description: `Destination payload (to send notification) depending on channel:
    - EMAIL → { email: string }
    - SMS → { phoneNumber: string }
    - PUSH → { deviceToken: string }`,
    oneOf: [
      { $ref: getSchemaPath(EmailPayloadDto) },
      { $ref: getSchemaPath(SmsPayloadDto) },
      { $ref: getSchemaPath(PushPayloadDto) },
    ],
  })
  @IsObject()
  payload: unknown;
}
