import { plainToInstance } from 'class-transformer';
import { ChannelStrategy } from '../domain/channel-strategy.interface';
import { PushPayload } from '../domain/types/create-notification-input.type';
import { DeliveryRepository } from './delivery.repository';
import { validateSync } from 'class-validator';
import { PushPayloadDto } from '../dto/push-payload.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ChannelTypes } from '../domain/enums/channel.enum';
import { Notification } from '../notification.entity';

@Injectable()
export class PushStrategy implements ChannelStrategy<PushPayload> {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  validate(payload: unknown): PushPayload {
    const dto = plainToInstance(PushPayloadDto, payload);
    const errors = validateSync(dto);

    if (errors.length > 0) throw new BadRequestException(errors);

    //  validar token y formatear payload?

    return dto;
  }

  async send(payload: PushPayload, notification: Notification): Promise<void> {
    //simular envio
    console.log(`Enviando push a ${payload.deviceToken}`);

    await this.deliveryRepository.create({
      notification,
      channel: ChannelTypes.PUSH,
      status: 'SENT',
      metadata: { deviceToken: payload.deviceToken },
      createdAt: new Date(),
    });
  }
}
