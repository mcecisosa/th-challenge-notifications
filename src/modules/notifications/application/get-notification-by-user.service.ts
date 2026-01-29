import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../infrastructure/notification.repository';
import { Notification } from '../notification.entity';

@Injectable()
export class GetNotificationByUserIdService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(id: number): Promise<Notification[]> {
    const notifications = await this.notificationRepository.findByIdUser(id);

    return notifications;
  }
}
