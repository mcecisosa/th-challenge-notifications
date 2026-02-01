import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ChannelTypes } from './domain/enums/channel.enum';
import { Notification } from './notification.entity';

@Entity('delivery')
export class Delivery {
  @ApiProperty({
    description: 'The unique identifier of the notification_delivery',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Notification, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'notification_id' })
  notification: Notification;

  @ApiProperty({
    description: 'The channel used to send notification',
    example: 'EMAIL',
  })
  @Column({ enum: ChannelTypes })
  channel: string;

  @ApiProperty({
    description: 'The status of the notification delivery',
    example: 'SENDEED',
  })
  @Column()
  status: string;

  @ApiProperty({
    description: 'The metadata of de notification delivery',
  })
  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column()
  createdAt: Date;

  constructor(partial: Partial<Delivery>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
