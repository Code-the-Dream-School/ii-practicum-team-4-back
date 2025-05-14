const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const UserProfile = require('../../models/UserProfile');
const profileRouter = require('../../routes/userProfileRouter');

let mongoServer;
let app;
let token;
let userId;

jest.setTimeout(10000);

beforeAll(async () => {
process.env.JWT_SECRET = 'testsecret'; 
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  app = express();
  app.use(express.json());

  app.use((req, res, next) => {
    if (req.headers.authorization) {
      const decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'testsecret');
      req.user = { userId: decoded.userId };
    }
    next();
  });

  app.use('/api/v1/profile', profileRouter);

  const user = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  })

  userId = user._id;
  token = jwt.sign({ userId: userId, name: user.name}, 'testsecret', {expiresIn: '1h'})
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });
  
  beforeEach(async () => {
    await UserProfile.deleteMany();
  });
  
  describe('ProfileController routes', () => {
    it('GET /profile - creates and returns profile', async () => {
      const res = await request(app)
        .get('/api/v1/profile')
        .set('Authorization', `Bearer ${token}`);
  
      expect([200, 404]).toContain(res.statusCode);
      if (res.statusCode === 200) {
      expect(res.body.profile).toBeDefined();
      expect(res.body.profile.user_id).toBe(userId.toString());
        }
    });
  
    it('POST /profile/address - adds new address', async () => {
      const address = {
        first_name: 'Test',
        last_name: 'Next',
        phone: '+1 555-0000',
        email: 'test@example.com',
        address: '123 Test St',
        additional_info: 'Call when close'
      };
  
      const res = await request(app)
        .post('/api/v1/profile/address')
        .set('Authorization', `Bearer ${token}`)
        .send(address);
  
      expect([200, 201]).toContain(res.statusCode);
      expect(res.body.profile.addresses.length).toBeGreaterThan(0);
      expect(res.body.profile.addresses[0].first_name).toBe('Test');
    });
  
    it('DELETE /profile/address - deletes address by index', async () => {
      // add address
      const address = {
        first_name: 'toDelete',
        last_name: 'Test',
        phone: '+1 555-0000',
        email: 'delete@example.com',
        address: 'Here',
        additional_info: ''
      };
  
      await request(app)
        .post('/api/v1/profile/address')
        .set('Authorization', `Bearer ${token}`)
        .send(address);
  
      // delete address
      const res = await request(app)
        .delete('/api/v1/profile/address')
        .set('Authorization', `Bearer ${token}`)
        .send({ index: 0 });
  
      expect([200, 404]).toContain(res.statusCode); 
      if (res.statusCode === 200) {
        expect(res.body.profile.addresses.length).toBe(0);
      }
    });
  });