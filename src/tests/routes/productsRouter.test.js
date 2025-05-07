const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');

const productsRouter = require('../../routes/productsRouter');
const Product = require('../../models/Product');

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
  app.use('/api/products', productsRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Product.deleteMany({});
});

describe('Products Router', () => {
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      await Product.create([
        { name: 'Carrot', category: 'vegetables', image: '' },
        { name: 'Apple', category: 'fruits', image: '' }
      ]);

      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(res.body.products.length).toBe(2);
      expect(res.body.products[0]).toHaveProperty('name', 'Carrot');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Spinach', category: 'greens', image: 'image.jpg' });

      expect(res.statusCode).toBe(201);
      expect(res.body.product.name).toBe('Spinach');

      const productInDb = await Product.findOne({ name: 'Spinach' });
      expect(productInDb).not.toBeNull();
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'NoCategory' });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toMatch(/required/i);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update a product', async () => {
      const product = await Product.create({ name: 'Tomato', category: 'vegetables' });

      const res = await request(app)
        .put(`/api/products/${product._id}`)
        .send({ name: 'Cherry Tomato', category: 'vegetables', image: '' });

      expect(res.statusCode).toBe(200);
      expect(res.body.product.name).toBe('Cherry Tomato');
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/products/${fakeId}`)
        .send({ name: 'Ghost', category: 'greens' });

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      const product = await Product.create({ name: 'Lettuce', category: 'greens' });

      const res = await request(app).delete(`/api/products/${product._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.msg).toMatch(/deleted/i);

      const deleted = await Product.findById(product._id);
      expect(deleted).toBeNull();
    });

    it('should return 404 if product not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/products/${fakeId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toMatch(/not found/i);
    });
  });
});
