const request = require('supertest');
const jwt = require('jsonwebtoken');
const axios = require('axios');

jest.mock('axios');

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
const Problem = require('../src/models/problems');
const User = require('../src/models/user');
const { connectDB, clearDB, closeDB } = require('./setup');

const TEST_JWT_KEY = 'test_secret_key_123';
process.env.JWT_KEY = TEST_JWT_KEY;

beforeAll(async () => {
    await connectDB();
}, 500000);
afterEach(async () => { 
    await clearDB();
    jest.clearAllMocks();
});
afterAll(async () => await closeDB());

describe('Problem API Security & Sanitization', () => {
  
  it('Should create a problem and sanitize unauthorized injected fields', async () => {
    
    const testAdmin = await User.create({
      firstName: "Admin",
      lastName: "CodeArena",
      emailId: "admin@codearena.com",
      password: "Hashed@1234",
      role: "admin"
    });

    const adminToken = jwt.sign({_id: testAdmin._id, role: 'admin' }, TEST_JWT_KEY);
    
    const mockPostResponse = { data: [{ token: 'fake-judge0-token-123' }] };
    
    // Added status_id, time, and memory ProblemUtility stops polling instantly!
    const mockGetResponse = { 
      data: { 
        submissions: [{ 
          status_id: 3, 
          status: { id: 3, description: 'Accepted' }, 
          stdout: 'olleh\n',
          time: '0.012',
          memory: 2048
        }] 
      } 
    };

    const axiosHandler = (configOrUrl, options) => {
      const config = typeof configOrUrl === 'object' ? configOrUrl : options;
      const method = (config && config.method) ? config.method.toUpperCase() : 'GET';
      
      if (method === 'GET') return Promise.resolve(mockGetResponse);
      return Promise.resolve(mockPostResponse);
    };

    axios.mockImplementation(axiosHandler);
    axios.request.mockImplementation(axiosHandler); 
    axios.post.mockResolvedValue(mockPostResponse);
    axios.get.mockResolvedValue(mockGetResponse);

    const payloadWithInjection = {
      title: 'Reverse String',
      description: 'Write a function to reverse a string.',
      difficulty: 'easy',
      tags: ['array'],
      visibleTestCases: [{
        input: '"hello"',
        output: '"olleh"',
        explanation: 'The reverse of hello is olleh.'
      }],
      hiddenTestCases: [{
        input: '"world"',
        output: '"dlrow"'
      }],
      startCode: [{
        language: 'cpp',
        boilerplate: 'string reverse(string s) {}'
      }],
      referenceSolution: [{
        language: 'cpp',
        completeCode: 'string reverse(string s) { /* logic */ }'
      }],
      isSystemAdmin: true,
      unauthorizedAccess: 'GRANTED'
    };
    
    const res = await request(app)
      .post('/problem/create')
      .set('Cookie', [`token=${adminToken}`])
      .send(payloadWithInjection);
      
    if (res.statusCode !== 201) {
      console.error("BACKEND REJECTION REASON:", res.body);
      console.error("TEXT RESPONSE:", res.text);
    }
    
    expect(res.statusCode).toBe(201);

    const savedProblem = await Problem.findOne({title:'Reverse String'});
    expect(savedProblem).toBeTruthy(); 
    expect(savedProblem.title).toBe('Reverse String');
    
    expect(savedProblem.isSystemAdmin).toBeUndefined();
    expect(savedProblem.unauthorizedAccess).toBeUndefined();
  });
});