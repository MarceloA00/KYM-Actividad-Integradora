const request = require('supertest');
const app = require('./app');

beforeAll(() => {
  mongoose.set('strictQuery', false);
});

describe('Health Check', () => {
  it('should return status UP', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('UP');
  });
});