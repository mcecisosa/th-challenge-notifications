import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  @Column({ unique: true })
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @Column()
  password: string;

  constructor(partial: Partial<User>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
