import { plainToInstance } from 'class-transformer';
import { ChannelStrategy } from '../domain/channel-strategy.interface';
import { PushPayload } from '../domain/types/create-notification-input.type';
import { DeliveryRepository } from './delivery.repository';
import { validateSync } from 'class-validator';
import { PushPayloadDto } from '../dto/push-payload.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ChannelTypes } from '../domain/enums/channel.enum';
import { Notification } from '../notification.entity';
import { PushClient } from 'src/clients/push.client';
import { DeliveryStatus } from '../domain/enums/delivery.enum';

@Injectable()
export class PushStrategy implements ChannelStrategy<PushPayload> {
  constructor(
    private readonly deliveryRepository: DeliveryRepository,
    private readonly pushClient: PushClient,
  ) {}

  validate(payload: unknown): PushPayload {
    const dto = plainToInstance(PushPayloadDto, payload);
    const errors = validateSync(dto);

    if (errors.length > 0) throw new BadRequestException(errors);

    //  validar token y formatear payload?

    return dto;
  }

  async send(payload: PushPayload, notification: Notification): Promise<void> {
    const newDelivery = await this.deliveryRepository.create({
      notification,
      channel: ChannelTypes.PUSH,
      status: DeliveryStatus.PENDING,
      metadata: { deviceToken: payload.deviceToken },
      createdAt: new Date(),
    });

    let status: string;
    try {
      const response = await this.pushClient.sendPush(
        payload.deviceToken,
        notification.title,
        notification.content,
      );
      status = DeliveryStatus.SENT;
      console.log('response of pushClient:', response);
    } catch (error) {
      console.log(error);
      status = DeliveryStatus.FAILED;
    }

    await this.deliveryRepository.update(newDelivery.id, {
      status: status,
    });
  }
}
