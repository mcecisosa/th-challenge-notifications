import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type PushSendResult = {
  messageId: string;
  sentAt: Date;
};

Injectable();
export class PushClient {
  constructor() {}

  async sendPush(
    deviceToken: string,
    title: string,
    body: string,
  ): Promise<PushSendResult> {
    const formattedPayload = {
      title: title,
      body: body,
    };

    console.log(`Sendind push to ${deviceToken}`);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log(
      `Push sent to ${deviceToken}, with title: ${formattedPayload.title} and body: ${formattedPayload.body}...`,
    );

    return {
      messageId: randomUUID(),
      sentAt: new Date(),
    };
  }
}
