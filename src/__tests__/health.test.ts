import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';
import { disconnectDatabase, getTestApp } from './setup.js';

describe('GET /health', () => {
  const app = getTestApp();

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('returns 200 with status ok when the database is reachable', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
