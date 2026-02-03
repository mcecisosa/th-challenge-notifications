import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../infrastructure/notification.repository';
import { EntityNotFoundError } from 'src/shared/errors/not-found.error';

@Injectable()
export class DeleteNotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(id: number): Promise<void> {
    const deleted = await this.notificationRepository.delete(id);

    if (!deleted) throw new EntityNotFoundError('Notification', id);
  }
}
