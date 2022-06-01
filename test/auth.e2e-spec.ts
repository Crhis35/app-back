import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getConnection } from 'typeorm';

const GRAPQHL_ENDPOINT = '/graphql';

const testUser = {
  username: 'test',
  email: 'test@test.com',
  password: 'test',
};
describe('UserModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });
  afterAll(async () => {
    await getConnection().dropDatabase();
    await app.close();
  });
  describe('createAccount', () => {
    it('it should create a user', async () => {
      return request(app.getHttpServer())
        .post(GRAPQHL_ENDPOINT)
        .send({
          query: `mutation{
            createUser(input: {
            username: "${testUser.username}",
            email: "${testUser.email}",
            password: "${testUser.password}",
            role: VISITOR
        }){
          ok
          error
        }
      }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createUser.ok).toBe(true);
          expect(res.body.data.createUser.error).toBe(null);
        });
    });
    it('should fail if account already exists', () => {
      return request(app.getHttpServer())
        .post(GRAPQHL_ENDPOINT)
        .send({
          query: `mutation{
            createUser(input: {
              username: "${testUser.username}",
              email: "${testUser.email}",
              password: "${testUser.password}",
              role: VISITOR
          }){
            ok
            error
          }
        }`,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.createUser.ok).toBe(false);
          expect(res.body.data.createUser.error).toEqual(expect.any(String));
          expect(res.body.data.createUser.error).toBe(
            'Could not create account',
          );
        });
    });
  });
  describe('login', () => {
    it('should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post(GRAPQHL_ENDPOINT)
        .send({
          query: `mutation{
          login(input: {
            email: "${testUser.email}",
            password: "${testUser.password}",
        }){
          ok
          token
          error
        }
      }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(true);
          expect(login.error).toBe(null);
          expect(login.token).toEqual(expect.any(String));
        });
    });
    it('should fail with incorrect credentials', () => {
      return request(app.getHttpServer())
        .post(GRAPQHL_ENDPOINT)
        .send({
          query: `mutation{
          login(input: {
            email: "${testUser.email}",
            password: "wrong",
        }){
          ok
          token
          error
        }
      }`,
        })
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: { login },
            },
          } = res;
          expect(login.ok).toBe(false);
          expect(login.error).toEqual(expect.any(String));
          expect(login.error).toBe('Could not login');
          expect(login.token).toBe(null);
        });
    });
  });
});
