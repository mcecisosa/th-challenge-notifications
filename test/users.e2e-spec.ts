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

describe('UserController (e2e)', () => {
  let testContext: TestAppContext;
  let app: INestApplication;
  let userRepository: Repository<User>;
  let token: string;

  beforeAll(async () => {
    jest.setTimeout(30000);
    //Initialize test app with the helper
    testContext = await initTestApp();

    //Extract what we need from the context
    app = testContext.app;
    userRepository = testContext.userRepository;

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
  });

  afterAll(async () => {
    //Restore axios mock
    //axiosGetSpy.mockRestore();

    //Clean up test app resources
    await closeTestApp(testContext);
  });

  beforeEach(async () => {
    //Reset test between tests
    await resetTestApp(testContext);

    //Reset axios mock calls
    //axiosGetSpy.mockClear();
  });

  describe('GET /users', () => {
    it('should return an empty array when no users exist', () => {
      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect([]);
    });

    it('should return all users', async () => {
      const usersData = [
        {
          username: 'user1',
          email: 'user1@example.com',
          password: 'password1',
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          password: 'password2',
        },
      ];

      await userRepository.save(usersData);

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      interface UserResponse {
        id: number;
        username: string;
        email: string;
      }

      const responseBody = response.body as UserResponse[];
      expect(responseBody).toHaveLength(2);
      expect(responseBody[0].username).toBe('user1');
      expect(responseBody[1].username).toBe('user2');
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user with pokemon details', async () => {
      //arrange (estos datos se puede sacar en un archivo aparte)
      const userData = {
        username: 'testUser',
        email: 'test@example.com',
        password: 'password123',
      };

      const user = await userRepository.save(userData);

      //act
      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      //expect
      interface UserResponse {
        id: number;
        username: string;
        email: string;
      }

      const responseBody = response.body as UserResponse;
      expect(responseBody.id).toBe(user.id);
      expect(responseBody.username).toBe('testUser');
      expect(responseBody.email).toBe('test@example.com');
    });

    it('should return a 404 if user does not exist', () => {
      return request(app.getHttpServer())
        .get('/users/9999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'newUser',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send(userData)
        .expect(201);

      const responseBody = response.body as User;
      expect(responseBody.id).toBeDefined();
      expect(responseBody.username).toBe('newUser');
      expect(responseBody.email).toBe('newuser@example.com');

      //verify the user was actually saved in DB
      const savedUser = await userRepository.findOneBy({ id: responseBody.id });

      expect(savedUser).not.toBeNull();
      expect(savedUser?.username).toBe('newUser');
    });
  });

  describe('PUT /users/:id', () => {
    it('should update a user', async () => {
      //arrange
      const userData = {
        username: 'updateUser',
        email: 'updateuser@example.com',
        password: 'password123',
      };

      const user = await userRepository.save(userData);

      const updateData = {
        username: 'updatedUsername',
      };

      //act
      const response = await request(app.getHttpServer())
        .put(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      //verify
      const responseBody = response.body as User;
      expect(responseBody.id).toBe(user.id);
      expect(responseBody.username).toBe('updatedUsername');
      expect(responseBody.email).toBe('updateuser@example.com');

      //verify changes were saved in DB
      const updatedUser = await userRepository.findOneBy({ id: user.id });
      expect(updatedUser).not.toBeNull();
      expect(updatedUser?.username).toBe('updatedUsername');
    });

    it('should return 404 if user does not exist', () => {
      return request(app.getHttpServer())
        .put('/users/999')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'userUpdate' })
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      //arrange
      const userData = {
        username: 'deleteUser',
        email: 'delete@example.com',
        password: 'password123',
      };

      const user = await userRepository.save(userData);

      //act & verify
      await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      //verify the user was deleted from DB
      const deletedUser = await userRepository.findOneBy({ id: user.id });
      expect(deletedUser).toBeNull();
    });

    it('should return 404 if user does not exist', () => {
      return request(app.getHttpServer())
        .delete('/users/9999')
        .set('Authorization', `Bearer ${token}`)
        .expect(404);
    });
  });
});
