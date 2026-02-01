import { plainToInstance } from 'class-transformer';
import { ChannelStrategy } from '../domain/channel-strategy.interface';
import { SmsPayload } from '../domain/types/create-notification-input.type';
import { DeliveryRepository } from './delivery.repository';
import { validateSync } from 'class-validator';
import { SmsPayloadDto } from '../dto/sms-payload.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ChannelTypes } from '../domain/enums/channel.enum';
import { Notification } from '../notification.entity';

@Injectable()
export class SmsStrategy implements ChannelStrategy<SmsPayload> {
  constructor(private readonly deliveryRepository: DeliveryRepository) {}

  validate(payload: unknown): SmsPayload {
    const dto = plainToInstance(SmsPayloadDto, payload);
    const errors = validateSync(dto);

    if (errors.length > 0) throw new BadRequestException(errors);

    // if (dto.message.length > 160)
    //   throw new BadRequestException('SMS exceeds 160 characters');

    return dto;
  }

  async send(payload: SmsPayload, notification: Notification): Promise<void> {
    //simular envio
    console.log(`Enviando sms a ${payload.phoneNumber}`);

    await this.deliveryRepository.create({
      notification,
      channel: ChannelTypes.SMS,
      status: 'SENT',
      metadata: { phoneNumber: payload.phoneNumber, sentAt: new Date() },
      createdAt: new Date(),
    });
  }
}
