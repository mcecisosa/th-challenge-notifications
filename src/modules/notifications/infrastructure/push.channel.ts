import { ChannelStrategy } from '../domain/channel-strategy.interface';

export class PushStrategy implements ChannelStrategy {
  send(): string {
    return 'aca se va a enviar por push';
  }
}
