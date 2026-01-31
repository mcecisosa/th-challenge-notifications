import { ChannelStrategy } from '../domain/channel-strategy.interface';

export class SmsStrategy implements ChannelStrategy {
  send(): string {
    return 'aca se va a enviar por sms';
  }
}
