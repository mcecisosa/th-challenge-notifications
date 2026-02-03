import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  closeTestApp,
  initTestApp,
  resetTestApp,
  TestAppContext,
} from './helpers/test-app.helper';
import { User } from 'src/modules/users/user.entity';
import { Repository } from 'typeorm';
import { BcryptPasswordHasherImpl } from 'src/shared/security/bcrypt-password-hasher.impl';
import { LoginResponseDto } from 'src/modules/auth/dto/login-user-response.dto';
import { Notification } from 'src/modules/notifications/notification.entity';
import { Delivery } from 'src/modules/notifications/delivery.entity';
import { ChannelTypes } from 'src/modules/notifications/domain/enums/channel.enum';
import { DeliveryStatus } from 'src/modules/notifications/domain/enums/delivery.enum';

describe('UserController (e2e)', () => {
  let testContext: TestAppContext;
  let app: INestApplication;
  let userRepository: Repository<User>;
  let notificationRepository: Repository<Notification>;
  let deliveryRepository: Repository<Delivery>;
  let token: string;
  let idUserLogged: number;
  let mockEmailClient: { sendMail: jest.Mock };
  let mockSmsClient: { sendSms: jest.Mock };
  let mockPushClient: { sendPush: jest.Mock };

  beforeAll(async () => {
    jest.setTimeout(30000);
    //Initialize test app with the helper
    testContext = await initTestApp();

    //Extract what we need from the context
    app = testContext.app;
    userRepository = testContext.userRepository;
    notificationRepository = testContext.notificationRepository;
    deliveryRepository = testContext.deliveryRepository;
    mockEmailClient = testContext.mockEmailClient;
    mockSmsClient = testContext.mockSmsClient;
    mockPushClient = testContext.mockPushClient;
  });

  afterAll(async () => {
    //Restore axios mock
    //axiosGetSpy.mockRestore();

    //Clean up test app resources
    await closeTestApp(testContext);
  });

  beforeEach(async () => {
    jest.resetAllMocks();
    //Reset test between tests
    await resetTestApp(testContext);

    const hasher = new BcryptPasswordHasherImpl();
    const hashedPassword = await hasher.hash('12345678');

    // 👤 usuario para login
    await userRepository.save({
      username: 'admin',
      email: 'admin@test.com',
      password: hashedPassword,
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'admin@test.com',
        password: '12345678',
      })
      .expect(201);

    const responseBody = response.body as LoginResponseDto;
    token = responseBody.accessToken;
    idUserLogged = responseBody.user.id;
  });

  describe('GET /notifications', () => {
    it('should return an empty array when no notifications exist', async () => {
      return await request(app.getHttpServer())
        .get('/notifications')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect([]);
    });

    it('should return all notifications of the logged-in user', async () => {
      const notifData = [
        {
          title: 'title push',
          content: 'content push',
          channel: 'PUSH',
          payload: { deviceToken: 'device-token-123' },
          user: { id: idUserLogged } as User,
        },
        {
          title: 'title email',
          content: 'content email',
          channel: 'EMAIL',
          payload: { email: 'test@example.com' },
          user: { id: idUserLogged } as User,
        },
        {
          title: 'title sms',
          content: 'content sms',
          channel: 'SMS',
          payload: { phoneNumber: '+5493534228999' },
          user: { id: idUserLogged } as User,
        },
      ];

      await notificationRepository.save(notifData);

      const response = await request(app.getHttpServer())
        .get('/notifications')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const responseBody = response.body as Notification[];
      expect(responseBody).toHaveLength(3);

      const titles = responseBody.map((n) => n.title);
      const channels = responseBody.map((n) => n.channel);
      expect(channels).toEqual(
        expect.arrayContaining(['EMAIL', 'PUSH', 'SMS']), //no tiene en cuenta el orden de c/channel en el array
      );
      expect(titles).toEqual(
        expect.arrayContaining(['title push', 'title email', 'title sms']),
      );
    });
  });

  describe('POST /notifications', () => {
    it('should create a notification with a push channel and send it through that channel', async () => {
      mockPushClient.sendPush.mockResolvedValue({
        messageId: 'mock-id',
        sentAt: new Date(),
      });
      const notifData = {
        title: 'title push',
        content: 'content push',
        channel: ChannelTypes.PUSH,
        payload: { deviceToken: 'device-token-123' },
      };

      const response = await request(app.getHttpServer())
        .post('/notifications')
        .set('Authorization', `Bearer ${token}`)
        .send(notifData)
        .expect(201);

      //verify response
      const responseBody = response.body as Notification;
      expect(responseBody.id).toBeDefined();
      expect(responseBody.title).toBe('title push');
      expect(responseBody.channel).toBe(ChannelTypes.PUSH);

      //verify the user was actually saved in DB
      const savedNotification = await notificationRepository.findOneBy({
        id: responseBody.id,
      });
      expect(savedNotification).not.toBeNull();
      expect(savedNotification?.title).toBe('title push');
      expect(savedNotification?.channel).toBe(ChannelTypes.PUSH);

      //verify pushClient was called
      expect(mockPushClient.sendPush).toHaveBeenCalledTimes(1);
      expect(mockPushClient.sendPush).toHaveBeenCalledWith(
        'device-token-123',
        'title push',
        'content push',
      );

      expect(mockEmailClient.sendMail).not.toHaveBeenCalled();
      expect(mockSmsClient.sendSms).not.toHaveBeenCalled();

      //verify the delivery notification was actually saved in DB
      const savedDelivery = await deliveryRepository.findOneBy({
        notification: { id: responseBody.id },
      });
      expect(savedDelivery).not.toBeNull();
      expect(savedDelivery?.channel).toBe(ChannelTypes.PUSH);
      expect(savedDelivery?.status).toBe(DeliveryStatus.SENT);
      expect(savedDelivery?.metadata.deviceToken).toBe('device-token-123');
    });

    it('should create a notification with a sms channel and send it through that channel', async () => {
      mockSmsClient.sendSms.mockResolvedValue({
        messageId: 'mock-id',
        sentAt: new Date(),
      });
      const notifData = {
        title: 'title sms',
        content: 'content sms',
        channel: ChannelTypes.SMS,
        payload: { phoneNumber: '+5493534228669' },
      };

      const response = await request(app.getHttpServer())
        .post('/notifications')
        .set('Authorization', `Bearer ${token}`)
        .send(notifData)
        .expect(201);

      //verify response
      const responseBody = response.body as Notification;
      expect(responseBody.id).toBeDefined();
      expect(responseBody.title).toBe('title sms');
      expect(responseBody.channel).toBe(ChannelTypes.SMS);

      //verify the user was actually saved in DB
      const savedNotification = await notificationRepository.findOneBy({
        id: responseBody.id,
      });
      expect(savedNotification).not.toBeNull();
      expect(savedNotification?.title).toBe('title sms');
      expect(savedNotification?.channel).toBe(ChannelTypes.SMS);

      //verify smsClient was called
      expect(mockSmsClient.sendSms).toHaveBeenCalledTimes(1);
      expect(mockSmsClient.sendSms).toHaveBeenCalledWith(
        '+5493534228669',
        'content sms',
      );

      expect(mockEmailClient.sendMail).not.toHaveBeenCalled();
      expect(mockPushClient.sendPush).not.toHaveBeenCalled();

      //verify the delivery notification was actually saved in DB
      const savedDelivery = await deliveryRepository.findOneBy({
        notification: { id: responseBody.id },
      });
      expect(savedDelivery).not.toBeNull();
      expect(savedDelivery?.channel).toBe(ChannelTypes.SMS);
      expect(savedDelivery?.status).toBe(DeliveryStatus.SENT);
      expect(savedDelivery?.metadata.phoneNumber).toBe('+5493534228669');
      expect(typeof savedDelivery?.metadata.sentAt).toBe('string');
    });

    it('should create a notification with a email channel and send it through that channel', async () => {
      mockEmailClient.sendMail.mockResolvedValue({
        messageId: 'mock-id',
        sentAt: new Date(),
      });
      const notifData = {
        title: 'title email',
        content: 'content email',
        channel: ChannelTypes.EMAIL,
        payload: { email: 'destination@example.com' },
      };

      const response = await request(app.getHttpServer())
        .post('/notifications')
        .set('Authorization', `Bearer ${token}`)
        .send(notifData)
        .expect(201);

      //verify response
      const responseBody = response.body as Notification;
      expect(responseBody.id).toBeDefined();
      expect(responseBody.title).toBe('title email');
      expect(responseBody.channel).toBe(ChannelTypes.EMAIL);

      //verify the user was actually saved in DB
      const savedNotification = await notificationRepository.findOneBy({
        id: responseBody.id,
      });
      expect(savedNotification).not.toBeNull();
      expect(savedNotification?.title).toBe('title email');
      expect(savedNotification?.channel).toBe(ChannelTypes.EMAIL);

      //verify smsClient was called
      expect(mockEmailClient.sendMail).toHaveBeenCalledTimes(1);
      expect(mockEmailClient.sendMail).toHaveBeenCalledWith(
        'destination@example.com',
        'title email',
        expect.any(String),
      );

      expect(mockSmsClient.sendSms).not.toHaveBeenCalled();
      expect(mockPushClient.sendPush).not.toHaveBeenCalled();

      //verify the delivery notification was actually saved in DB
      const savedDelivery = await deliveryRepository.findOneBy({
        notification: { id: responseBody.id },
      });
      expect(savedDelivery).not.toBeNull();
      expect(savedDelivery?.channel).toBe(ChannelTypes.EMAIL);
      expect(savedDelivery?.status).toBe(DeliveryStatus.SENT);
      expect(savedDelivery?.metadata.email).toBe('destination@example.com');
    });
  });

  describe('PUT /notifications/:id', () => {
    it('should update a notification', async () => {
      //arrange
      const notifData = {
        title: 'title push',
        content: 'content push',
        channel: 'PUSH',
        payload: { deviceToken: 'device-token-123' },
        user: { id: idUserLogged } as User,
      };

      const notification = await notificationRepository.save(notifData);

      const updateData = {
        title: 'title updated',
      };

      //act
      const response = await request(app.getHttpServer())
        .put(`/notifications/${notification.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      //verify
      const responseBody = response.body as Notification;
      expect(responseBody.id).toBe(notification.id);
      expect(responseBody.title).toBe('title updated');

      //verify changes were saved in DB
      const updatedNotif = await notificationRepository.findOneBy({
        id: notification.id,
      });
      expect(updatedNotif).not.toBeNull();
      expect(updatedNotif?.title).toBe('title updated');
    });

    it('should return 404 if notification does not exist', () => {
      return request(app.getHttpServer())
        .put('/notifications/999')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'title PUSH updated' })
        .expect(404);
    });
  });

  describe('DELETE /notifications/:id', () => {
    it('should delete a notification', async () => {
      //arrange
      const notifData = {
        title: 'this is the title push',
        content: 'this is the content push',
        channel: 'PUSH',
        payload: { deviceToken: 'device-token-123' },
        user: { id: idUserLogged } as User,
      };

      const notification = await notificationRepository.save(notifData);

      //act & verify
      await request(app.getHttpServer())
        .delete(`/notifications/${notification.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      //verify the notification was deleted from DB
      const deletedNotif = await notificationRepository.findOneBy({
        id: notification.id,
      });
      expect(deletedNotif).toBeNull();
    });

    it('should return 404 if notification does not exist', () => {
      return request(app.getHttpServer())
        .delete('/notifications/9999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
