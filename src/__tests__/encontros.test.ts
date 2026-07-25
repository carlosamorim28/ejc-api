import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { cleanupDatabase, disconnectDatabase, getTestApp } from './setup.js';

const UNKNOWN_ID = '00000000-0000-4000-8000-000000000000';

describe('/encontros', () => {
  const app = getTestApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('runs the full create/list/read/update/delete cycle', async () => {
    const created = await request(app)
      .post('/encontros')
      .send({ tema: 'Encontro de Jovens 2026', ano: '2026-07-15' });

    expect(created.status).toBe(201);
    expect(created.body.id).toEqual(expect.any(String));
    expect(created.body.tema).toBe('Encontro de Jovens 2026');
    expect(created.body.ano).toContain('2026-07-15');

    const list = await request(app).get('/encontros');

    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(created.body.id);

    const found = await request(app).get(`/encontros/${created.body.id}`);

    expect(found.status).toBe(200);
    expect(found.body.tema).toBe('Encontro de Jovens 2026');

    const updated = await request(app)
      .put(`/encontros/${created.body.id}`)
      .send({ tema: 'Encontro de Jovens 2027', ano: '2027-01-10' });

    expect(updated.status).toBe(200);
    expect(updated.body.tema).toBe('Encontro de Jovens 2027');
    expect(updated.body.ano).toContain('2027-01-10');

    const removed = await request(app).delete(`/encontros/${created.body.id}`);

    expect(removed.status).toBe(204);
    expect(removed.body).toEqual({});

    const afterDelete = await request(app).get(`/encontros/${created.body.id}`);

    expect(afterDelete.status).toBe(404);
  });

  it('accepts a partial update', async () => {
    const created = await request(app)
      .post('/encontros')
      .send({ tema: 'Tema original', ano: '2026-01-01' });

    const updated = await request(app)
      .put(`/encontros/${created.body.id}`)
      .send({ tema: 'Tema novo' });

    expect(updated.status).toBe(200);
    expect(updated.body.tema).toBe('Tema novo');
    expect(updated.body.ano).toContain('2026-01-01');
  });

  it('returns an empty list when there is no encontro', async () => {
    const res = await request(app).get('/encontros');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('rejects a payload without required fields', async () => {
    const res = await request(app).post('/encontros').send({});

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
    expect(res.body.error.details.map((d: { path: string }) => d.path)).toEqual(
      expect.arrayContaining(['tema', 'ano']),
    );
  });

  it('rejects a tema longer than 150 characters', async () => {
    const res = await request(app)
      .post('/encontros')
      .send({ tema: 'a'.repeat(151), ano: '2026-07-15' });

    expect(res.status).toBe(400);
    expect(res.body.error.details[0].path).toBe('tema');
  });

  it('accepts a tema with exactly 150 characters', async () => {
    const res = await request(app)
      .post('/encontros')
      .send({ tema: 'a'.repeat(150), ano: '2026-07-15' });

    expect(res.status).toBe(201);
  });

  it('rejects an invalid ano', async () => {
    const res = await request(app)
      .post('/encontros')
      .send({ tema: 'Tema valido', ano: 'not-a-date' });

    expect(res.status).toBe(400);
    expect(res.body.error.details[0].path).toBe('ano');
  });

  it('rejects an invalid id format', async () => {
    const res = await request(app).get('/encontros/abc');

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
  });

  it('returns 404 when reading an unknown id', async () => {
    const res = await request(app).get(`/encontros/${UNKNOWN_ID}`);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Encontro not found');
  });

  it('returns 404 when updating an unknown id', async () => {
    const res = await request(app)
      .put(`/encontros/${UNKNOWN_ID}`)
      .send({ tema: 'Tema novo' });

    expect(res.status).toBe(404);
  });

  it('returns 404 when deleting an unknown id', async () => {
    const res = await request(app).delete(`/encontros/${UNKNOWN_ID}`);

    expect(res.status).toBe(404);
  });
});
