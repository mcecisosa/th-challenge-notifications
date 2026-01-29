import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../infrastructure/notification.repository';
import { Notification } from '../notification.entity';
import { NotificationNotFoundError } from '../domain/errors/notification-not-found.error';

@Injectable()
export class UpdateNotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(
    id: number,
    notificationData: Partial<Notification>,
  ): Promise<Notification> {
    const notificationUpdated = await this.notificationRepository.update(
      id,
      notificationData,
    );

    if (!notificationUpdated) throw new NotificationNotFoundError(id);

    return notificationUpdated;
  }
}
