const request = require('supertest');
const jwt = require('jsonwebtoken');
jest.mock('../src/config/redis', () => ({
    connect: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    setEx: jest.fn(),
    del: jest.fn(),
    on: jest.fn(),
    quit: jest.fn(),
    exists: jest.fn().mockResolvedValue(0),
    incr: jest.fn().mockResolvedValue(1), 
    expire: jest.fn().mockResolvedValue(1),
}));

const app = require('../src/index');
const User = require('../src/models/user');
const { connectDB, clearDB, closeDB } = require('./setup'); 

const TEST_JWT_KEY = 'test_secret_key_123';
process.env.JWT_KEY = TEST_JWT_KEY;

beforeAll(async () => {
  await connectDB();
},500000);
afterEach(async () => await clearDB());
afterAll(async () => await closeDB());

describe('Auth Middleware Security Tests', () => {
  const mockUserId = '64f1a2b3c4d5e6f7a8b9c0d1';
  //1 . no jwt token
  it('1. Should block request without Authorization header', async () => {
    const res = await request(app).get('/user/check');
    expect(res.statusCode).toBe(401);
  });
  //2. fake jwt token not signed with secret key 
  it('2. Should reject invalid/tampered token', async () => {

    
    const res = await request(app).get('/user/check').set('Authorization', 'Bearer invalid.fake.token');

    expect(res.statusCode).toBe(401);
  });
  // 3 . real token signed by real secret key
  it('3. Should pass auth check when valid JWT is provided', async () => {
    const testUser = await User.create({
      firstName: "Test",
      lastName: "User",
      emailId: "test@codearena.com",
      password: "Hashed@1234"
    });

    const token = jwt.sign({ _id: testUser._id }, TEST_JWT_KEY, { expiresIn: '1h' });


    const res = await request(app).get('/user/check').set('Cookie', [`token=${token}`]);


    expect(res.statusCode).not.toBe(401);
  });
});