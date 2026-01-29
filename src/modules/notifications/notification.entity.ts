import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ChannelTypes } from './domain/enums/channel.enum';

@Entity('notifications')
export class Notification {
  @ApiProperty({
    description: 'The unique identifier of the notification',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty({
    description: 'The title of the notification',
    example: 'Hello friend',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'The content of the notification',
    example: 'I write you....',
  })
  @Column()
  content: string;

  @ApiProperty({
    description: 'The channel to send the notification',
    example: ChannelTypes,
  })
  @Column({ enum: ChannelTypes })
  channel: string;
}
