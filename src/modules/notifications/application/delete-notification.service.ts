import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../infrastructure/notification.repository';
import { NotificationNotFoundError } from '../domain/errors/notification-not-found.error';

@Injectable()
export class DeleteNotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const deleted = await this.notificationRepository.delete(id);

    if (!deleted) throw new NotificationNotFoundError(id);
  }
}
