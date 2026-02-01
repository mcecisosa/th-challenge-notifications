import { BadRequestException, Injectable } from '@nestjs/common';
import { EmailStrategy } from './email.channel';
import { SmsStrategy } from './sms.channel';
import { PushStrategy } from './push.channel';
import { ChannelTypes } from '../domain/enums/channel.enum';
import { ChannelStrategy } from '../domain/channel-strategy.interface';

@Injectable()
export class ChannelStrategyResolver {
  constructor(
    private readonly emailStrategy: EmailStrategy,
    private readonly smsStrategy: SmsStrategy,
    private readonly pushStrategy: PushStrategy,
  ) {}

  resolve(channel: ChannelTypes): ChannelStrategy<unknown> {
    switch (channel) {
      case ChannelTypes.EMAIL:
        return this.emailStrategy;
      case ChannelTypes.SMS:
        return this.smsStrategy;
      case ChannelTypes.PUSH:
        return this.pushStrategy;
      default:
        throw new BadRequestException(`Unsupported channel`);
    }
  }
}
