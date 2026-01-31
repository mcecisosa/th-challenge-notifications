import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationRepository } from '../infrastructure/notification.repository';
import { Notification } from '../notification.entity';
import { CreateNotificationInput } from '../domain/types/create-notification-input.type';
import { User } from 'src/modules/users/user.entity';
import { ChannelTypes } from '../domain/enums/channel.enum';
import { EmailPayloadDto } from '../dto/email-payload.dto';
import { plainToInstance } from 'class-transformer';
import { SmsPayloadDto } from '../dto/sms-payload.dto';
import { PushPayloadDto } from '../dto/push-payload.dto';
import { validateSync } from 'class-validator';

@Injectable()
export class CreateNotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(input: CreateNotificationInput): Promise<Notification> {
    this.validateByChannel(input.channel, input.payload);
    //-------
    const newNotification = this.notificationRepository.create({
      title: input.title,
      content: input.content,
      channel: input.channel,
      user: { id: input.currUserId } as User,
    });

    // luego → strategy.send(...)

    return newNotification;
  }

  private validateByChannel(channel: ChannelTypes, payload: unknown) {
    let dto;

    switch (channel) {
      case ChannelTypes.EMAIL:
        dto = plainToInstance(EmailPayloadDto, payload);
        break;

      case ChannelTypes.SMS:
        dto = plainToInstance(SmsPayloadDto, payload);
        break;

      case ChannelTypes.PUSH:
        dto = plainToInstance(PushPayloadDto, payload);
        break;
    }

    const errors = validateSync(dto);
    if (errors.length > 0) throw new BadRequestException(errors);
  }
}

//CreateNotificationUseCase
// - recibe BaseDto
// - según channel:
//     - valida DTO específico
//     - elige ChannelStrategy
//     - ejecuta send()
