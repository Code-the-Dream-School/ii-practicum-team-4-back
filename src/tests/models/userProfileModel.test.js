const mongoose= require('mongoose');
const User = require('../../models/User');
const UserProfile = require('../../models/UserProfile');
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
    await UserProfile.deleteMany();
})

describe( 'UserProfile model test', () => {
    it('It should create and save a valid user profile with one address', async () => {
        const userId = new mongoose.Types.ObjectId();

        const profileData = {
            user_id: userId,
            addresses: [{
              first_name: 'Test',
              last_name: 'User',
              phone: '+1 111 111 1111',
              email: 'test@profile.com',
              address: '123 Profile Street',
              additional_info: 'Test address'
            }]
        };

        const userProfile = new UserProfile(profileData);
        const savedUserProfile = await userProfile.save();

        expect(savedUserProfile._id).toBeDefined();
        expect(savedUserProfile.user_id.toString()).toBe(userId.toString());
        expect(savedUserProfile.addresses.length).toBe(1);
        expect(savedUserProfile.addresses[0].first_name).toBe('Test');
        expect(savedUserProfile.addresses[0].address).toBe('123 Profile Street');
    } );

    it('should throw validation error if required fields are missed in address', async () => {
        const userId = new mongoose.Types.ObjectId();

        const profileData = {
            user_id: userId,
            addresses: [{
                last_name: 'MissedFields'

            }]
        };

        let err;
        try{
            await UserProfile.create(profileData);
        } catch( error) {
            err = error
        }

        expect(err).toBeDefined();
        expect(err.name).toBe('ValidationError');
        expect(err.errors['addresses.0.first_name']).toBeDefined();
        expect(err.errors['addresses.0.phone']).toBeDefined();
        expect(err.errors['addresses.0.address']).toBeDefined();
    });

    it('should not allow dublicate user_id', async () => {
       const userId = new mongoose.Types.ObjectId();

        const profileData = {
            user_id: userId,
            addresses: [{
                first_name: 'Test',
                phone: '+1 510 0000',
                address: '123 First street',
            }]
        };

        await UserProfile.create(profileData);

        let err;
        try {
            await UserProfile.create(profileData)
        } catch (error) {
            err = error;
        }

        expect (err).toBeDefined();
        expect(err.code).toBe(11000);
    } )
})