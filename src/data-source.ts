import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { join } from 'path';
import { User } from './modules/users/user.entity';
import { Notification } from './modules/notifications/notification.entity';
import { Delivery } from './modules/notifications/delivery.entity';

// Load environment variables from .env file
dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

// Get environment variables with fallbacks
// const host = process.env.DATABASE_HOST || 'localhost';
// const port = parseInt(process.env.DATABASE_PORT || '5432');
// const username = process.env.DATABASE_USER || 'postgres';
// const password = process.env.DATABASE_PASSWORD || 'postgres';
// const database = process.env.DATABASE_NAME || 'app_dev';
//const synchronize = process.env.DATABASE_SYNC === 'true' ? true : false;

const dataSourceConfig = {
  type: 'postgres' as const,
  url: process.env.DATABASE_URL,
  // host,
  // port,
  // username,
  // password,
  // database,
  entities: [User, Notification, Delivery],
  synchronize: true,
  migrations: [
    join(__dirname, '..', 'migrations', '*.{ts,js}'),
    join(__dirname, '..', 'seed-migrations', '*.{ts,js}'),
  ],
  migrationsTableName: 'custom_migration_table',
};

console.log(
  'DB CONFIG:',
  process.env.DATABASE_URL ? 'DATABASE_URL OK' : 'DATABASE_URL MISSING',
);

export const AppDataSource = new DataSource(dataSourceConfig);
