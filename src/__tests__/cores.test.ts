import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { cleanupDatabase, disconnectDatabase, getTestApp } from './setup.js';

const UNKNOWN_ID = '00000000-0000-4000-8000-000000000000';

const validCor = {
  nome: 'Vermelho',
};

describe('/cores', () => {
  const app = getTestApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('runs the full create/list/read/update/delete cycle', async () => {
    const created = await request(app).post('/cores').send(validCor);

    expect(created.status).toBe(201);
    expect(created.body.id).toEqual(expect.any(String));
    expect(created.body.nome).toBe('Vermelho');

    const list = await request(app).get('/cores');

    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(created.body.id);

    const found = await request(app).get(`/cores/${created.body.id}`);

    expect(found.status).toBe(200);
    expect(found.body.nome).toBe('Vermelho');

    const updated = await request(app)
      .put(`/cores/${created.body.id}`)
      .send({ nome: 'Azul' });

    expect(updated.status).toBe(200);
    expect(updated.body.nome).toBe('Azul');

    const removed = await request(app).delete(`/cores/${created.body.id}`);

    expect(removed.status).toBe(204);
    expect(removed.body).toEqual({});

    const afterDelete = await request(app).get(`/cores/${created.body.id}`);

    expect(afterDelete.status).toBe(404);
  });

  it('returns an empty list when there is no cor', async () => {
    const res = await request(app).get('/cores');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('rejects a payload without required fields', async () => {
    const res = await request(app).post('/cores').send({});

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
    expect(res.body.error.details.map((d: { path: string }) => d.path)).toEqual(
      expect.arrayContaining(['nome']),
    );
  });

  it('rejects a nome longer than 50 characters', async () => {
    const res = await request(app)
      .post('/cores')
      .send({ nome: 'a'.repeat(51) });

    expect(res.status).toBe(400);
    expect(res.body.error.details[0].path).toBe('nome');
  });

  it('accepts a nome with exactly the max length', async () => {
    const res = await request(app)
      .post('/cores')
      .send({ nome: 'a'.repeat(50) });

    expect(res.status).toBe(201);
  });

  it('rejects an invalid id format', async () => {
    const res = await request(app).get('/cores/abc');

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
  });

  it('returns 404 when reading an unknown id', async () => {
    const res = await request(app).get(`/cores/${UNKNOWN_ID}`);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Cor not found');
  });

  it('returns 404 when updating an unknown id', async () => {
    const res = await request(app)
      .put(`/cores/${UNKNOWN_ID}`)
      .send({ nome: 'Verde' });

    expect(res.status).toBe(404);
  });

  it('returns 404 when deleting an unknown id', async () => {
    const res = await request(app).delete(`/cores/${UNKNOWN_ID}`);

    expect(res.status).toBe(404);
  });
});
