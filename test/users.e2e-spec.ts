import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  closeTestApp,
  initTestApp,
  resetTestApp,
  TestAppContext,
} from './helpers/test-app.helper';
import axios from 'axios';
import { User } from 'src/modules/users/domain/entity/user.entity';
import { Repository } from 'typeorm';

describe('UserController (e2e)', () => {
  let testContext: TestAppContext;
  let app: INestApplication;
  let userRepository: Repository<User>;
  let axiosGetSpy: jest.SpyInstance;

  // Pokemon mock data used for tests
  const mockPokemonData = [
    { id: 1, name: 'bulbasaur' },
    { id: 4, name: 'charmander' },
    { id: 7, name: 'squirtle' },
  ];

  //helper function to extract Pokemon ID from URL
  const getPokemonIdFromUrl = (url: string): number | null => {
    for (const pokemon of mockPokemonData) {
      if (url.includes(`/pokemon/${pokemon.id}`)) {
        return pokemon.id;
      }
    }
    return null;
  };

  beforeAll(async () => {
    jest.setTimeout(30000);
    //Initialize test app with the helper
    testContext = await initTestApp();

    //Extract what we need from the context
    app = testContext.app;
    userRepository = testContext.userRepository;

    //Setup axios spy for Pokemon endpoints
    const originalAxiosGet = (url: string) => axios.get(url);

    axiosGetSpy = jest.spyOn(axios, 'get').mockImplementation((url: string) => {
      //Check if the URL contains a Pokemon ID we want to mock (esto se puede sacar en otro archivo)
      const pokemonId = getPokemonIdFromUrl(url);
      if (pokemonId !== null) {
        const pokemon = mockPokemonData.find((p) => p.id === pokemonId);
        return Promise.resolve({ data: pokemon });
      }
      //for others URLs, call the orgininal axios.get
      return originalAxiosGet(url);
    });
  });

  afterAll(async () => {
    //Restore axios mock
    axiosGetSpy.mockRestore();

    //Clean up test app resources
    await closeTestApp(testContext);
  });

  beforeEach(async () => {
    //Reset test between tests
    await resetTestApp(testContext);

    //Reset axios mock calls
    axiosGetSpy.mockClear();
  });

  describe('GET /users', () => {
    it('should return an empty array when no users exist', () => {
      return request(app.getHttpServer()).get('/users').expect(200).expect([]);
    });

    it('should return all users', async () => {
      const usersData = [
        {
          username: 'user1',
          email: 'user1@example.com',
          password: 'password1',
          pokemonIds: [1, 4],
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          password: 'password2',
          pokemonIds: [7],
        },
      ];

      await userRepository.save(usersData);

      const response = await request(app.getHttpServer())
        .get('/users')
        .expect(200);

      interface UserResponse {
        id: number;
        username: string;
        email: string;
        pokemonIds: number[];
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
        pokemonIds: [1, 4],
      };

      const user = await userRepository.save(userData);

      //act
      const response = await request(app.getHttpServer()).get(
        `/users/${user.id}`,
      );

      //expect
      interface UserWithPokemonResponse {
        id: number;
        username: string;
        email: string;
        pokemonIds: number[];
        pokemon: Array<{ id: number; name: string }>;
      }

      const responseBody = response.body as UserWithPokemonResponse;
      expect(responseBody.id).toBe(user.id);
      expect(responseBody.username).toBe('testUser');
      expect(responseBody.email).toBe('test@example.com');
      expect(responseBody.pokemonIds).toEqual([1, 4]);
      expect(responseBody.pokemon).toHaveLength(2);
      expect(responseBody.pokemon[0].name).toBe('bulbasaur');
      expect(responseBody.pokemon[1].name).toBe('charmander');

      //verify axios was called for Pokemon endpoint
      expect(axiosGetSpy).toHaveBeenCalledTimes(2);
    });

    it('should return a 404 if user does not exist', () => {
      return request(app.getHttpServer()).get('/users/9999').expect(404);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'newUser',
        email: 'newuser@example.com',
        password: 'password123',
        pokemonIds: [7],
      };

      const response = await request(app.getHttpServer())
        .post('/users')
        .send(userData)
        .expect(201);

      const responseBody = response.body as User;
      expect(responseBody.id).toBeDefined();
      expect(responseBody.username).toBe('newUser');
      expect(responseBody.email).toBe('newuser@example.com');
      expect(responseBody.pokemonIds).toEqual([7]);

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
        pokemonIds: [1],
      };

      const user = await userRepository.save(userData);

      const updateData = {
        username: 'updatedUsername',
        pokemonIds: [1, 4],
      };

      //act
      const response = await request(app.getHttpServer())
        .put(`/users/${user.id}`)
        .send(updateData)
        .expect(200);

      //verify
      const responseBody = response.body as User;
      expect(responseBody.id).toBe(user.id);
      expect(responseBody.username).toBe('updatedUsername');
      expect(responseBody.email).toBe('updateuser@example.com');
      expect(responseBody.pokemonIds).toEqual([1, 4]);

      //verify changes were saved in DB
      const updatedUser = await userRepository.findOneBy({ id: user.id });
      expect(updatedUser).not.toBeNull();
      expect(updatedUser?.username).toBe('updatedUsername');
      expect(updatedUser?.pokemonIds).toEqual([1, 4]);
    });

    it('should return 404 if user does not exist', () => {
      return request(app.getHttpServer())
        .put('/users/999')
        .send({ username: 'userUpdate' })
        .expect(404);
    });
  });

  describe('PUT /users/:id/pokemon', () => {
    it('should update a user pokemon IDs', async () => {
      //arrange
      const userData = {
        username: 'pokemonUser',
        email: 'pokemon@example.com',
        password: 'password123',
        pokemonIds: [1],
      };

      const user = await userRepository.save(userData);

      const updateData = {
        pokemonIds: [4, 7],
      };

      //act
      const response = await request(app.getHttpServer())
        .put(`/users/${user.id}/pokemon`)
        .send(updateData)
        .expect(200);

      //verify
      const responseBody = response.body as User;
      expect(responseBody.id).toBe(user.id);
      expect(responseBody.username).toBe('pokemonUser');
      expect(responseBody.pokemonIds).toEqual([4, 7]);

      //verify changes were saved in DB
      const updatedUser = await userRepository.findOneBy({ id: user.id });
      expect(updatedUser).not.toBeNull();
      expect(updatedUser?.pokemonIds).toEqual([4, 7]);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      //arrange
      const userData = {
        username: 'deleteUser',
        email: 'delete@example.com',
        password: 'password123',
        pokemonIds: [],
      };

      const user = await userRepository.save(userData);

      //act & verify
      await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .expect(200);

      //verify the user was deleted from DB
      const deletedUser = await userRepository.findOneBy({ id: user.id });
      expect(deletedUser).toBeNull();
    });

    it('should return 404 if user does not exist', () => {
      return request(app.getHttpServer()).delete('/users/9999').expect(404);
    });
  });
});
