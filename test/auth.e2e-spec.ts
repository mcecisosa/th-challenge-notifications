import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Repository } from 'typeorm';
import { BcryptPasswordHasherImpl } from 'src/shared/security/bcrypt-password-hasher.impl';
import { User } from 'src/modules/users/user.entity';
import {
  closeTestApp,
  initTestApp,
  resetTestApp,
  TestAppContext,
} from './helpers/test-app.helper';
import { LoginResponseDto } from 'src/modules/auth/dto/login-user-response.dto';

describe('AuthController (e2e)', () => {
  let testContext: TestAppContext;
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    testContext = await initTestApp();
    app = testContext.app;
    userRepository = testContext.userRepository;
  });

  afterAll(async () => {
    await closeTestApp(testContext);
  });

  beforeEach(async () => {
    //Reset test between tests
    await resetTestApp(testContext);

    // 🔐 Hash real UNA sola vez
    const passwordHasher = new BcryptPasswordHasherImpl();
    const hashedPassword = await passwordHasher.hash('12345678');

    // 👤 Usuario real en DB
    await userRepository.save({
      username: 'juan',
      email: 'juan@example.com',
      password: hashedPassword,
    });
  });

  describe('POST /auth/login', () => {
    it('should return an access token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'juan@example.com',
          password: '12345678',
        })
        .expect(201);

      const responseBody = response.body as LoginResponseDto;
      expect(responseBody).toHaveProperty('accessToken');
      expect(typeof responseBody.accessToken).toBe('string');
    });

    it('should return 401 if password is wrong', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'juan@example.com',
          password: 'wrong-password',
        })
        .expect(401);
    });
  });
});
