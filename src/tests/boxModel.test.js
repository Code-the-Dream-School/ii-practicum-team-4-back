const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Box = require('../models/Box'); // adjust path if needed

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
  await Box.deleteMany({});
});

describe('Box Model', () => {
  it('should create a valid box', async () => {
    const box = new Box({
      name: 'Small Box',
      weight: 5,
      price: 15,
    });

    const savedBox = await box.save();
    expect(savedBox._id).toBeDefined();
    expect(savedBox.name).toBe('Small Box');
    expect(savedBox.weight).toBe(5);
    expect(savedBox.price).toBe(15);
  });

  it('should trim name field', async () => {
    const box = new Box({
      name: '  Medium Box  ',
      weight: 10,
      price: 25,
    });

    const savedBox = await box.save();
    expect(savedBox.name).toBe('Medium Box');
  });

  it('should throw validation error for missing name', async () => {
    const box = new Box({
      weight: 8,
      price: 20,
    });

    let err;
    try {
      await box.save();
    } catch (e) {
      err = e;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });

  it('should throw validation error for missing weight', async () => {
    const box = new Box({
      name: 'Heavy Box',
      price: 30,
    });

    let err;
    try {
      await box.save();
    } catch (e) {
      err = e;
    }

    expect(err.errors.weight).toBeDefined();
  });

  it('should throw validation error for missing price', async () => {
    const box = new Box({
      name: 'Premium Box',
      weight: 20,
    });

    let err;
    try {
      await box.save();
    } catch (e) {
      err = e;
    }

    expect(err.errors.price).toBeDefined();
  });

  it('should enforce unique name constraint', async () => {
    const box1 = new Box({
      name: 'Unique Box',
      weight: 7,
      price: 12,
    });

    const box2 = new Box({
      name: 'Unique Box',
      weight: 9,
      price: 18,
    });

    await box1.save();
    let err;
    try {
      await box2.save();
    } catch (e) {
      err = e;
    }

    // Note: unique constraint errors come from MongoDB, not Mongoose validation
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // MongoDB duplicate key error
  });
});
