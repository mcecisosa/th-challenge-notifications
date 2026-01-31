import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../notification.entity';
import { Repository } from 'typeorm';

export class NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  create(notifData: Omit<Notification, 'id'>): Promise<Notification> {
    const notif = this.notificationRepository.create(notifData);
    return this.notificationRepository.save(notif);
  }

  findById(id: number): Promise<Notification | null> {
    return this.notificationRepository.findOneBy({ id });
  }

  findByIdUser(id: number): Promise<Notification[]> {
    return this.notificationRepository.find({ where: { user: { id: id } } });
  }

  async update(
    id: number,
    notificationData: Partial<Notification>,
  ): Promise<Notification | null> {
    const result = await this.notificationRepository.update(
      id,
      notificationData,
    );

    if (result.affected === 0) return null;

    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.notificationRepository.delete(id);

    return result.affected !== 0; //!==0 es true, borro el registro
  }
}
