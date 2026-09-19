const request = require('supertest');
const app = require('./server');

describe('REST API Automated Unit and Integration Tests', () => {
  it('GET / should return status online', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('online');
  });

  it('GET /health should return status healthy', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('healthy');
  });

  it('GET /api/items should return array of items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/items should create new item', async () => {
    const res = await request(app).post('/api/items').send({ name: 'Pipeline Task' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual('Pipeline Task');
  });

  it('POST /api/items should reject item without name', async () => {
    const res = await request(app).post('/api/items').send({});
    expect(res.statusCode).toEqual(400);
  });
});