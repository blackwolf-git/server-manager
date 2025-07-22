const request = require('supertest');
const app = require('../server');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

describe('Authentication Tests', () => {
  beforeAll(async () => {
    await User.create({
      full_name: 'Test User',
      phone_number: '+123456789',
      email: 'test@example.com',
      password_hash: await bcrypt.hash('password123', 10)
    });
  });

  afterAll(async () => {
    await User.destroy({ where: {} });
  });

  test('POST /api/auth/register - should register a new user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        full_name: 'New User',
        phone_number: '+987654321',
        email: 'new@example.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user).toHaveProperty('id');
  });

  test('POST /api/auth/login - should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('token');
  });
});
