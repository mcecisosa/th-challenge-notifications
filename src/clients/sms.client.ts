import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type SmsSendResult = {
  messageId: string;
  sentAt: Date;
};

const SMS_BODY_LENGHT = 160;

Injectable();
export class SmsClient {
  constructor() {}

  async sendSms(phoneNumber: string, message: string): Promise<SmsSendResult> {
    const messageLimited = message.slice(0, SMS_BODY_LENGHT);
    console.log(`Sendind sms to ${phoneNumber}`);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log(
      `SMS sent to ${phoneNumber}, with content: ${messageLimited}...`,
    );

    return {
      messageId: randomUUID(),
      sentAt: new Date(),
    };
  }
}
