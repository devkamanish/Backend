const request = require('supertest');
const app = require('../src/app');

describe('Auth Integration Tests', () => {
  it('should signup successfully', async () => {
    const res = await request(app).post('/auth/signup').send({ email: 'test@test.com', password: '123456' });
    expect(res.statusCode).toBe(201);
  });

  it('should login successfully and return JWT', async () => {
    await request(app).post('/auth/signup').send({ email: 'test@test.com', password: '123456' });
    const res = await request(app).post('/auth/login').send({ email: 'test@test.com', password: '123456' });
    expect(res.body.token).toBeDefined();
  });

  it('should fail login with invalid credentials', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'fake@test.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });

  it('should fail accessing protected route without token', async () => {
    const res = await request(app).get('/todos');
    expect(res.statusCode).toBe(401);
  });

  it('should fail accessing protected route with invalid token', async () => {
    const res = await request(app).get('/todos').set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toBe(401);
  });
});
