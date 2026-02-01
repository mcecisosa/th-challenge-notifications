import { Notification } from '../notification.entity';

export interface ChannelStrategy<TPayload> {
  validate(payload: unknown): TPayload;
  send(payload: TPayload, notification: Notification): Promise<void>;
}
