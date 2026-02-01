import { plainToInstance } from 'class-transformer';
import { ChannelStrategy } from '../domain/channel-strategy.interface';
import { EmailPayload } from '../domain/types/create-notification-input.type';
import { EmailPayloadDto } from '../dto/email-payload.dto';
import { validateSync } from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DeliveryRepository } from './delivery.repository';
import { ChannelTypes } from '../domain/enums/channel.enum';
import { Notification } from '../notification.entity';

@Injectable()
export class EmailStrategy implements ChannelStrategy<EmailPayload> {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  validate(payload: unknown): EmailPayload {
    const dto = plainToInstance(EmailPayloadDto, payload);
    const errors = validateSync(dto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return dto;
  }
  async send(payload: EmailPayload, notification: Notification): Promise<void> {
    //simular envio
    console.log(`Enviando email a ${payload.email}`);

    await this.deliveryRepository.create({
      notification,
      channel: ChannelTypes.EMAIL,
      status: 'SENT',
      metadata: { email: payload.email },
      createdAt: new Date(),
    });
  }
}

//aca deberia llamar al service externo como el pokemon api
