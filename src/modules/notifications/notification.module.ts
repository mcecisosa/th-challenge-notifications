import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './infrastructure/notification.repository';
import { DeleteNotificationService } from './application/delete-notification.service';
import { UpdateNotificationService } from './application/update-notification.service';
import { GetNotificationByUserIdService } from './application/get-notification-by-user.service';
import { CreateNotificationService } from './application/create-notification.service';
import { ChannelStrategyResolver } from './infrastructure/strategy-resolver';
import { EmailStrategy } from './infrastructure/email.channel';
import { SmsStrategy } from './infrastructure/sms.channel';
import { PushStrategy } from './infrastructure/push.channel';
import { DeliveryRepository } from './infrastructure/delivery.repository';
import { Delivery } from './delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Delivery])],
  controllers: [NotificationController],
  providers: [
    NotificationRepository,
    DeliveryRepository,
    CreateNotificationService,
    ChannelStrategyResolver,
    EmailStrategy,
    SmsStrategy,
    PushStrategy,
    GetNotificationByUserIdService,
    UpdateNotificationService,
    DeleteNotificationService,
  ],
  exports: [],
})
export class NotificationModule {}
