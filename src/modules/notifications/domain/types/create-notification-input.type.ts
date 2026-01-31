import { ChannelTypes } from '../enums/channel.enum';

export type CreateNotificationInput = {
  title: string;
  content: string;
  channel: ChannelTypes;
  payload: unknown;
  currUserId: number;
};

export type EmailPayload = { email: string };

export type SmsPayload = { phoneNumber: string };

export type PushPayload = { deviceToken: string };

export type NotificationPayload = EmailPayload | SmsPayload | PushPayload;
