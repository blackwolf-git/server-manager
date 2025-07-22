const request = require('supertest');
const app = require('../server');
const { User, Service } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

describe('API Tests', () => {
  let authToken;
  let testUserId;
  let testServiceId;

  beforeAll(async () => {
    // Create test user
    const user = await User.create({
      full_name: 'API Test User',
      phone_number: '+111111111',
      email: 'apitest@example.com',
      password_hash: 'hashedpassword'
    });
    testUserId = user.id;

    // Create test service
    const service = await Service.create({
      name: 'Test Service',
      description: 'Test Description',
      price: 99.99
    });
    testServiceId = service.id;

    // Generate JWT token
    authToken = jwt.sign({ id: testUserId }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  });

  afterAll(async () => {
    await User.destroy({ where: {} });
    await Service.destroy({ where: {} });
  });

  test('GET /api/services - should get all services', async () => {
    const response = await request(app).get('/api/services');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);
  });

  test('POST /api/contact - should create contact request (authenticated)', async () => {
    const response = await request(app)
      .post('/api/contact')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        service_id: testServiceId,
        purpose: 'Test purpose'
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('id');
  });
});
