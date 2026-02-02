import { Provider } from '@nestjs/common';
import { EmailClient } from './mail.client';
import { SmsClient } from './sms.client';
import { PushClient } from './push.client';

export const ClientsProviders: Provider[] = [
  EmailClient,
  SmsClient,
  PushClient,
];
