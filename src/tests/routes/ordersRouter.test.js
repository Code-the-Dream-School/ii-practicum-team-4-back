const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const express = require('express');

const Order = require('../../models/Order');
const Box = require('../../models/Box');
const Product = require('../../models/Product');
const ordersRouter = require('../../routes/ordersRouter');

let app, mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  app = express();
  app.use(express.json());
  app.use('/api/orders', ordersRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Promise.all([
    Order.deleteMany({}),
    Box.deleteMany({}),
    Product.deleteMany({})
  ]);
});

describe('Orders Router', () => {
  let userId, productId, boxId;

  beforeEach(async () => {
    userId = new mongoose.Types.ObjectId();
    productId = (await Product.create({ name: 'Apple', category: 'fruits' }))._id;
    boxId = (await Box.create({ name: 'Small Box', weight: 5, price: 35 }))._id;
  });

  describe('POST /api/orders', () => {
    it('should create a new order and pack items into boxes', async () => {
      const items = [{ product_id: productId, weight: 5 }];

      const res = await request(app)
        .post('/api/orders')
        .send({
          user_id: userId,
          items,
          delivery_address: '123 Farm Road',
          delivery_first_name: 'Alice',
          delivery_last_name: 'Green',
          delivery_phone: '1234567890',
          delivery_email: 'alice@example.com',
          delivery_additional_info: ''
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.order).toHaveProperty('_id');
      expect(res.body.order.boxes.length).toBe(1);
      expect(res.body.order.totalOrderPrice).toBe(35);
    });

    it('should return 400 if user_id or items are missing', async () => {
      const res = await request(app).post('/api/orders').send({});
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/orders', () => {
    it('should return all orders for a user', async () => {
      await Order.createOrderWithBoxes(
        {
          user_id: userId,
          delivery_address: '456 River St',
          delivery_first_name: 'Bob',
          delivery_last_name: 'Smith',
          delivery_email: 'bob@example.com'
        },
        [{ product_id: productId, weight: 10 }]
      );

      const res = await request(app).get(`/api/orders?user_id=${userId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.orders.length).toBe(1);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return a specific order', async () => {
      const order = await Order.createOrderWithBoxes(
        {
          user_id: userId,
          delivery_address: '789 Hilltop',
          delivery_first_name: 'Charlie',
          delivery_last_name: 'Brown',
          delivery_email: 'charlie@example.com'
        },
        [{ product_id: productId, weight: 200 }]
      );

      const res = await request(app).get(`/api/orders/${order._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.order).toHaveProperty('_id');
    });

    it('should return 404 if order not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/orders/${fakeId}`);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/orders/:id', () => {
    it('should update the status of an order', async () => {
      const order = await Order.createOrderWithBoxes(
        {
          user_id: userId,
          delivery_address: '22 Oak St',
          delivery_first_name: 'Dana',
          delivery_last_name: 'Jones',
          delivery_email: 'dana@example.com'
        },
        [{ product_id: productId, weight: 10 }]
      );

      const res = await request(app)
        .put(`/api/orders/${order._id}`)
        .send({ status: 'shipped' });

      expect(res.statusCode).toBe(200);
      expect(res.body.order.status).toBe('shipped');
    });

    it('should return 404 if order does not exist', async () => {
      const res = await request(app)
        .put(`/api/orders/${new mongoose.Types.ObjectId()}`)
        .send({ status: 'cancelled' });

      expect(res.statusCode).toBe(404);
    });
  });
});
