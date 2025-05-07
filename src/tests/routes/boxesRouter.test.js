const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');

const boxRouter = require('../../routes/boxesRouter');
const Box = require('../../models/Box');

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app = express();
  app.use(express.json());
  app.use('/api/boxes', boxRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Box.deleteMany({});
});

describe('Boxes Router', () => {
  describe('GET /api/boxes', () => {
    it('should return all boxes', async () => {
      await Box.create([
        { name: 'Small', weight: 5, price: 10 },
        { name: 'Large', weight: 10, price: 18 }
      ]);

      const res = await request(app).get('/api/boxes');

      expect(res.statusCode).toBe(200);
      expect(res.body.boxes.length).toBe(2);
      expect(res.body.boxes.map((box) => (box.name)).sort()).toEqual(['Large', 'Small']);
    });
  });

  describe('POST /api/boxes', () => {
    it('should create a new box', async () => {
      const res = await request(app)
        .post('/api/boxes')
        .send({ name: 'Medium', weight: 7, price: 15 });

      expect(res.statusCode).toBe(201);
      expect(res.body.box).toHaveProperty('name', 'Medium');

      const boxInDb = await Box.findOne({ name: 'Medium' });
      expect(boxInDb).not.toBeNull();
    });

    it('should return 400 if missing fields', async () => {
      const res = await request(app)
        .post('/api/boxes')
        .send({ name: 'Invalid' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/required/i);
    });
  });

  describe('PUT /api/boxes/:id', () => {
    it('should update a box', async () => {
      const box = await Box.create({ name: 'Old Box', weight: 5, price: 10 });

      const res = await request(app)
        .put(`/api/boxes/${box._id}`)
        .send({ name: 'Updated Box', weight: 6, price: 12 });

      expect(res.statusCode).toBe(200);
      expect(res.body.box.name).toBe('Updated Box');
    });

    it('should return 404 if box not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/boxes/${nonExistentId}`)
        .send({ name: 'Nonexistent', weight: 5, price: 10 });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });
  });

  describe('DELETE /api/boxes/:id', () => {
    it('should delete a box', async () => {
      const box = await Box.create({ name: 'ToDelete', weight: 4, price: 8 });

      const res = await request(app).delete(`/api/boxes/${box._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.msg).toMatch(/deleted/i);

      const boxInDb = await Box.findById(box._id);
      expect(boxInDb).toBeNull();
    });

    it('should return 404 for nonexistent box', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/boxes/${nonExistentId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });
  });
});
