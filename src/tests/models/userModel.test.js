const mongoose= require('mongoose');
const User = require('../../models/User');
const {MongoMemoryServer} = require ('mongodb-memory-server');

let mongoServer;

jest.setTimeout(10000);

beforeAll (async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
})

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany();
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

    it ('should not dublicate emails', async () => {
        const userData = {
            name: 'User One',
            email: 'duplicate@example.com',
            password: 'pass123',
        };
        await User.create(userData);

        let err;
        try{
            await User.create(userData);
        } catch( error) {
            err = error
        }

        expect(err).toBeDefined();
        expect(err.code).toBe(11000);
    });

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

    it ('should correctly compare password', async () => {
        const user = new User({
            name: 'Compare user',
            email: 'compare@test.com',
            password: 'mypassword',
        });

        await user.save();

        const isValid = await user.comparePassword('mypassword');
        const isInvalid = await user.comparePassword('wrongpassword');
        expect (isValid).toBe(true);
        expect(isInvalid).toBe(false);
    } )
})