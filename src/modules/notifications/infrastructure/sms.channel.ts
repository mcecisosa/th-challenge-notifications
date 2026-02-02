import { plainToInstance } from 'class-transformer';
import { ChannelStrategy } from '../domain/channel-strategy.interface';
import { SmsPayload } from '../domain/types/create-notification-input.type';
import { DeliveryRepository } from './delivery.repository';
import { validateSync } from 'class-validator';
import { SmsPayloadDto } from '../dto/sms-payload.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ChannelTypes } from '../domain/enums/channel.enum';
import { Notification } from '../notification.entity';
import { SmsClient } from 'src/clients/sms.client';
import { DeliveryStatus } from '../domain/enums/delivery.enum';

@Injectable()
export class SmsStrategy implements ChannelStrategy<SmsPayload> {
  constructor(
    private readonly deliveryRepository: DeliveryRepository,
    private readonly smsClient: SmsClient,
  ) {}

  validate(payload: unknown): SmsPayload {
    const dto = plainToInstance(SmsPayloadDto, payload);
    const errors = validateSync(dto);

    if (errors.length > 0) throw new BadRequestException(errors);

    return dto;
  }

  async send(payload: SmsPayload, notification: Notification): Promise<void> {
    const newDelivery = await this.deliveryRepository.create({
      notification,
      channel: ChannelTypes.SMS,
      status: DeliveryStatus.PENDING,
      metadata: { phoneNumber: payload.phoneNumber, sentAt: new Date() },
      createdAt: new Date(),
    });

    let status: string;
    try {
      const response = await this.smsClient.sendSms(
        payload.phoneNumber,
        notification.content,
      );
      status = DeliveryStatus.SENT;
      console.log('response of emailClient:', response);
    } catch (error) {
      console.log(error);
      status = DeliveryStatus.FAILED;
    }

    await this.deliveryRepository.update(newDelivery.id, {
      status: status,
    });
  }
}
