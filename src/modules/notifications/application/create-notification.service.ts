import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../infrastructure/notification.repository';
import { Notification } from '../notification.entity';
import { CreateNotificationInput } from '../domain/types/create-notification-input.type';
import { User } from 'src/modules/users/user.entity';
import { ChannelStrategyResolver } from '../infrastructure/strategy-resolver';

@Injectable()
export class CreateNotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly strategyResolver: ChannelStrategyResolver,
  ) {}

  async execute(input: CreateNotificationInput): Promise<Notification> {
    const strategy = this.strategyResolver.resolve(input.channel);

    const validatePayload = strategy.validate(input.payload);

    const newNotification = await this.notificationRepository.create({
      title: input.title,
      content: input.content,
      channel: input.channel,
      user: { id: input.currUserId } as User,
    });

    await strategy.send(validatePayload, newNotification);

    return newNotification;
  }
}

//CreateNotificationUseCase
// - recibe BaseDto
// - según channel:
//     - valida DTO específico
//     - elige ChannelStrategy
//     - ejecuta send()
