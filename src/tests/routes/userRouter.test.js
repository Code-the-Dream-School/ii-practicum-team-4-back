const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const authRouter = require('../../routes/authRouter');

let mongoServer;
let app;

jest.setTimeout(10000);

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecret'; 
  process.env.JWT_LIFETIME = '1h';
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());
  app.use('/api/v1/auth', authRouter);
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });
  
  beforeEach(async () => {
    await User.deleteMany();
  });
  
  describe('Auth routes', () => {
    it('GET /auth - able to get route', async () => {
        const res = await request(app).get('/api/v1/auth');
        expect(res.statusCode).toBe(200);
        expect(res.body.msg).toBe('Auth route exist');
    });
  
    it('POST /register - register new user', async () => {
        const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.user.name).toBe('Test User');
        expect(res.body.token).toBeDefined();
    });
  
    it('POST/login - login as existing user', async () => {
        await User.create({
            name: 'Login User',
            email: 'login@example.com',
            password: 'password123',
        });

        const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
            email: 'login@example.com',
            password: 'password123',
      });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.user.name).toBe('Login User');
      expect(res.body.token).toBeDefined();
    });

    it('GET/current - returns current user if right token', async() => {
        const user = await User.create({
            name: 'Current User',
            email: 'current@example.com',
            password: 'password123',
        });

        const token = jwt.sign({ userId: user._id, name: user.name }, 'testsecret', {
        expiresIn: '1h',
        });

        const res = await request(app)
        .get('/api/v1/auth/current')
        .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.user.name).toBe('Current User');
        expect(res.body.user.email).toBe('current@example.com');
        });

        it('GET/current - returns error if no token', async() => {
            const res = await request(app).get('/api/v1/auth/current');
            expect(res.statusCode).toBe(401);
        });
  });
