import { plainToInstance } from 'class-transformer';
import { ChannelStrategy } from '../domain/channel-strategy.interface';
import { EmailPayload } from '../domain/types/create-notification-input.type';
import { EmailPayloadDto } from '../dto/email-payload.dto';
import { validateSync } from 'class-validator';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DeliveryRepository } from './delivery.repository';
import { ChannelTypes } from '../domain/enums/channel.enum';
import { Notification } from '../notification.entity';
import { EmailClient } from 'src/clients/mail.client';
import { DeliveryStatus } from '../domain/enums/delivery.enum';

@Injectable()
export class EmailStrategy implements ChannelStrategy<EmailPayload> {
  constructor(
    private readonly deliveryRepository: DeliveryRepository,
    private readonly emailClient: EmailClient,
  ) {}

  validate(payload: unknown): EmailPayload {
    const dto = plainToInstance(EmailPayloadDto, payload);
    const errors = validateSync(dto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return dto;
  }
  async send(payload: EmailPayload, notification: Notification): Promise<void> {
    const newDelivery = await this.deliveryRepository.create({
      notification,
      channel: ChannelTypes.EMAIL,
      status: DeliveryStatus.PENDING,
      metadata: { email: payload.email },
      createdAt: new Date(),
    });

    const templateEmail = `html template email mock con content: ${notification.content}`;

    let status: string;
    try {
      const response = await this.emailClient.sendMail(
        payload.email,
        notification.title,
        templateEmail,
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
