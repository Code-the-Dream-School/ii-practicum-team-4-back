const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const Product = require('../../models/Product');
const Box = require('../../models/Box');
const Order = require('../../models/Order');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Promise.all([
    Product.deleteMany({}),
    Box.deleteMany({}),
    Order.deleteMany({})
  ]);
});

describe('Order Model', () => {
  it('creates an order with packed boxes and correct total price', async () => {
    const smallBox = await Box.create({ name: 'Small Box', weight: 5, price: 10 });
    const largeBox = await Box.create({ name: 'Large Box', weight: 10, price: 18 });

    const apple = await Product.create({ name: 'Apple', category: 'fruits' });
    const carrot = await Product.create({ name: 'Carrot', category: 'vegetables' });

    const userId = new mongoose.Types.ObjectId();

    const orderData = {
      user_id: userId,
      delivery_address: '123 Farm Lane',
      delivery_first_name: 'John',
      delivery_last_name: 'Doe',
      delivery_phone: '1234567890',
      delivery_email: 'john@example.com',
    };

    const items = [
      { product_id: apple._id, weight: 6 },
      { product_id: carrot._id, weight: 3 },
    ];

    const order = await Order.createOrderWithBoxes(orderData, [...items]);

    expect(order.boxes.length).toBeGreaterThan(0);
    const totalWeight = order.boxes.reduce(
      (sum, box) => sum + box.items.reduce((s, i) => s + i.weight, 0), 0
    );
    const originalWeight = items.reduce((sum, i) => sum + i.weight, 0);
    expect(totalWeight).toEqual(originalWeight);

    const expectedPrice = order.boxes.reduce((sum, box) => {
      const matchedBox = [smallBox, largeBox].find(b => b._id.toString() === box.box_id.toString());
      return sum + (matchedBox ? matchedBox.price : 0);
    }, 0);

    expect(order.totalOrderPrice).toBe(expectedPrice);
    expect(order.status).toBe('pending');
    expect(order.user_id.toString()).toBe(userId.toString());
    expect(order.boxes[0].box_id.toString()).toBe(largeBox._id.toString());
  });

  it('validates required fields', async () => {
    const invalidOrder = new Order({});

    let err;
    try {
      await invalidOrder.validate();
    } catch (e) {
      err = e;
    }

    expect(err.errors.user_id).toBeDefined();
    expect(err.errors.delivery_address).toBeDefined();
    expect(err.errors.delivery_email).toBeDefined();
  });

  it('validates delivery_email format', async () => {
    const order = new Order({
      user_id: new mongoose.Types.ObjectId(),
      delivery_address: 'Farm 1',
      delivery_first_name: 'Fiona',
      delivery_last_name: 'Field',
      delivery_email: 'bademail',
    });

    let err;
    try {
      await order.validate();
    } catch (e) {
      err = e;
    }

    expect(err.errors.delivery_email).toBeDefined();
    expect(err.errors.delivery_email.message).toMatch(/valid email/);
  });
});
