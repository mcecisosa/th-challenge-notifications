import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../infrastructure/notification.repository';
import { Notification } from '../notification.entity';
import { EntityNotFoundError } from 'src/shared/errors/not-found.error';

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

    if (!notificationUpdated) throw new EntityNotFoundError('Notification', id);

    return notificationUpdated;
  }
}
