const request = require('supertest');
const app = require('../src/app');

let token, userId, todoId;

beforeEach(async () => {
  await request(app).post('/auth/signup').send({ email: 'user1@test.com', password: '123456' });
  const res = await request(app).post('/auth/login').send({ email: 'user1@test.com', password: '123456' });
  token = res.body.token;
});

describe('Todos Integration Tests', () => {
  it('should create a todo', async () => {
    const res = await request(app)
      .post('/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo 1', description: 'Test', status: 'pending' });
    expect(res.statusCode).toBe(201);
    todoId = res.body.id;
  });

  it('should get all todos for the logged-in user', async () => {
    await request(app).post('/todos').set('Authorization', `Bearer ${token}`).send({ title: 'T1', description: '', status: 'pending' });
    const res = await request(app).get('/todos').set('Authorization', `Bearer ${token}`);
    expect(res.body.length).toBe(1);
  });

  it('should update a specific todo for the owner', async () => {
    const todo = await request(app).post('/todos').set('Authorization', `Bearer ${token}`).send({ title: 'T1', description: '', status: 'pending' });
    const res = await request(app).put(`/todos/${todo.body.id}`).set('Authorization', `Bearer ${token}`).send({ title: 'Updated' });
    expect(res.body.title).toBe('Updated');
  });

  it('should fail updating a todo not owned by the user', async () => {
    const otherRes = await request(app).post('/auth/signup').send({ email: 'user2@test.com', password: '123456' });
    const loginRes = await request(app).post('/auth/login').send({ email: 'user2@test.com', password: '123456' });
    const otherToken = loginRes.body.token;

    const todo = await request(app).post('/todos').set('Authorization', `Bearer ${token}`).send({ title: 'T1', description: '', status: 'pending' });

    const res = await request(app)
      .put(`/todos/${todo.body.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Hack' });

    expect(res.statusCode).toBe(403);
  });

  it('should delete a specific todo', async () => {
    const todo = await request(app).post('/todos').set('Authorization', `Bearer ${token}`).send({ title: 'T1', description: '', status: 'pending' });
    const res = await request(app).delete(`/todos/${todo.body.id}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });
});
    