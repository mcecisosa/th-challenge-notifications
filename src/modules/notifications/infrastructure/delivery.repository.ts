import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Delivery } from '../delivery.entity';

export class DeliveryRepository {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) {}

  create(deliveryData: Omit<Delivery, 'id'>): Promise<Delivery> {
    const delivery = this.deliveryRepository.create(deliveryData);
    return this.deliveryRepository.save(delivery);
  }

  async update(id: number, deliveryData: Partial<Delivery>): Promise<void> {
    await this.deliveryRepository.update(id, deliveryData);
    return;
  }
}
