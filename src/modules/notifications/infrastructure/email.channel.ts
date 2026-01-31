import { ChannelStrategy } from '../domain/channel-strategy.interface';

export class EmailStrategy implements ChannelStrategy {
  send(): string {
    return 'aca se va a enviar por email';
  }
}

//aca deberia llamar al service externo como el pokemon api
