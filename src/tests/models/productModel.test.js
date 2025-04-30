const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Product = require('../../models/Product');

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
  await Product.deleteMany({});
});

describe('Product Model', () => {
  it('should create a valid product', async () => {
    const product = new Product({
      name: 'Tomatoes',
      category: 'vegetables',
      image: 'http://example.com/tomatoes.jpg',
    });

    const savedProduct = await product.save();
    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe('Tomatoes');
    expect(savedProduct.category).toBe('vegetables');
    expect(savedProduct.image).toBe('http://example.com/tomatoes.jpg');
  });

  it('should throw validation error for missing name', async () => {
    const product = new Product({
      category: 'fruits',
    });

    let err;
    try {
      await product.save();
    } catch (e) {
      err = e;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.name).toBeDefined();
  });

  it('should throw validation error for invalid category', async () => {
    const product = new Product({
      name: 'Dragonfruit',
      category: 'exotic',
    });

    let err;
    try {
      await product.save();
    } catch (e) {
      err = e;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.category).toBeDefined();
  });

  it('should trim name and category fields', async () => {
    const product = new Product({
      name: '  Carrot  ',
      category: '  vegetables ',
    });

    const savedProduct = await product.save();
    expect(savedProduct.name).toBe('Carrot');
    expect(savedProduct.category).toBe('vegetables');
  });
});
