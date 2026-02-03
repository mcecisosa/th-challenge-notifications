import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { EmailClient } from 'src/clients/mail.client';
import { PushClient } from 'src/clients/push.client';
import { SmsClient } from 'src/clients/sms.client';
import { Delivery } from 'src/modules/notifications/delivery.entity';
import { Notification } from 'src/modules/notifications/notification.entity';
import { User } from 'src/modules/users/user.entity';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';
import { DataSource, Repository } from 'typeorm';

export interface TestAppContext {
  app: INestApplication;
  dataSource: DataSource;
  userRepository: Repository<User>;
  notificationRepository: Repository<Notification>;
  deliveryRepository: Repository<Delivery>;
  mockEmailClient: { sendMail: jest.Mock };
  mockSmsClient: { sendSms: jest.Mock };
  mockPushClient: { sendPush: jest.Mock };
}

//Initialize a test application with test database configuration
export async function initTestApp(): Promise<TestAppContext> {
  const mockEmailClient = { sendMail: jest.fn() };
  const mockSmsClient = { sendSms: jest.fn() };
  const mockPushClient = { sendPush: jest.fn() };

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(EmailClient)
    .useValue(mockEmailClient)
    .overrideProvider(SmsClient)
    .useValue(mockSmsClient)
    .overrideProvider(PushClient)
    .useValue(mockPushClient)
    .compile();

  const app = moduleFixture.createNestApplication();

  //Get the DataSource before initializing the app
  const dataSource = moduleFixture.get<DataSource>(DataSource);

  //reset DB (drop and recreate tables)
  await dataSource.dropDatabase();
  await dataSource.synchronize();

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.init();

  //Get repository
  const userRepository = dataSource.getRepository(User);
  const notificationRepository = dataSource.getRepository(Notification);
  const deliveryRepository = dataSource.getRepository(Delivery);
  return {
    app,
    dataSource,
    userRepository,
    notificationRepository,
    deliveryRepository,
    mockEmailClient,
    mockSmsClient,
    mockPushClient,
  };
}

//close test application and DB connections
export async function closeTestApp(context: TestAppContext): Promise<void> {
  const { app, dataSource /* , userRepository */ } = context;

  //Clean up test data
  //await userRepository.clear(); //hace truncate table

  //Close connections
  await dataSource.destroy();
  await app.close();
}

//reset DB state between tests
export async function resetTestApp(context: TestAppContext): Promise<void> {
  const { dataSource /* , userRepository */ } = context;

  //Clear all data
  //await userRepository.clear();
  await truncateAll(dataSource);

  //Reset the database schema
  //await dataSource.synchronize(true); //TODO ver de sacar
}

export async function truncateAll(dataSource: DataSource) {
  await dataSource.query(`
    TRUNCATE TABLE
      notifications,
      users
    RESTART IDENTITY CASCADE
  `);
}
