import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type MailSendResult = {
  messageId: string;
  sentAt: Date;
};

Injectable();
export class EmailClient {
  constructor() {}

  async sendMail(
    to: string,
    subject: string,
    body: string,
  ): Promise<MailSendResult> {
    console.log(`Sendind email to ${to}`);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log(
      `Email sent to ${to}, with title: ${subject}, and body: ${body}...`,
    );

    return {
      messageId: randomUUID(),
      sentAt: new Date(),
    };
  }
}
