import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './infrastructure/notification.repository';
import { DeleteNotificationService } from './application/delete-notification.service';
import { UpdateNotificationService } from './application/update-notification.service';
import { GetNotificationByUserIdService } from './application/get-notification-by-user.service';
import { CreateNotificationService } from './application/create-notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationController],
  providers: [
    NotificationRepository,
    CreateNotificationService,
    GetNotificationByUserIdService,
    UpdateNotificationService,
    DeleteNotificationService,
  ],
  exports: [],
})
export class NotificationModule {}
