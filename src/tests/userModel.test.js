const mongoose= require('mongoose');
const User = require('../models/User');
const {MongoMemoryServer} = require ('mongodb-memory-server');

let mongoServer;

beforeAll (async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
})

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
})

describe( 'User model test', () => {
    it('have to create and save user', async () => {
        const userData = {
            name: 'Test user',
            email: 'test@example.com',
            password: 'test123',
        }

        const user = new User(userData);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe(userData.name);
        expect(savedUser.email).toBe(userData.email);
        expect(savedUser.password).not.toBe(userData.password);
    } );
    it('should create valid JWT token', async () => {
        process.env.JWT_SECRET = 'testsecret';
        process.env.JWT_LIFETIME = '1h';

        const user = new User({
            name: 'JWT user',
            email: 'jwt@test.com',
            password: 'jwtpassword',
        });
        await user.save();

        const token = user.createJWT();
        expect (typeof token).toBe('string');
        expect(token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/);
        
    } )
})