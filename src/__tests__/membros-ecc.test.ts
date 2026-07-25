import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { cleanupDatabase, disconnectDatabase, getTestApp } from './setup.js';

const UNKNOWN_ID = '00000000-0000-4000-8000-000000000000';

const validMembro = {
  nome: 'Maria Silva',
  endereco: 'Rua das Flores, 123',
  telefone: '11999999999',
};

describe('/membros-ecc', () => {
  const app = getTestApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('runs the full create/list/read/update/delete cycle', async () => {
    const created = await request(app)
      .post('/membros-ecc')
      .send({ ...validMembro, conjugueId: null, dataCasamento: '2020-06-15' });

    expect(created.status).toBe(201);
    expect(created.body.id).toEqual(expect.any(String));
    expect(created.body.nome).toBe('Maria Silva');
    expect(created.body.conjugueId).toBeNull();
    expect(created.body.dataCasamento).toBe('2020-06-15T00:00:00.000Z');

    const list = await request(app).get('/membros-ecc');

    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(created.body.id);

    const found = await request(app).get(`/membros-ecc/${created.body.id}`);

    expect(found.status).toBe(200);
    expect(found.body.nome).toBe('Maria Silva');

    const updated = await request(app)
      .put(`/membros-ecc/${created.body.id}`)
      .send({ nome: 'Maria Souza', dataCasamento: null });

    expect(updated.status).toBe(200);
    expect(updated.body.nome).toBe('Maria Souza');
    expect(updated.body.dataCasamento).toBeNull();

    const removed = await request(app).delete(
      `/membros-ecc/${created.body.id}`,
    );

    expect(removed.status).toBe(204);
    expect(removed.body).toEqual({});

    const afterDelete = await request(app).get(
      `/membros-ecc/${created.body.id}`,
    );

    expect(afterDelete.status).toBe(404);
  });

  it('creates members with an omitted or null conjugueId', async () => {
    const omitted = await request(app).post('/membros-ecc').send(validMembro);
    const nullable = await request(app)
      .post('/membros-ecc')
      .send({ ...validMembro, nome: 'Ana Silva', conjugueId: null });

    expect(omitted.status).toBe(201);
    expect(omitted.body.conjugueId).toBeNull();
    expect(nullable.status).toBe(201);
    expect(nullable.body.conjugueId).toBeNull();
  });

  it('creates a member with a valid spouse', async () => {
    const spouse = await request(app)
      .post('/membros-ecc')
      .send({ ...validMembro, nome: 'Joao Silva' });

    const created = await request(app)
      .post('/membros-ecc')
      .send({ ...validMembro, conjugueId: spouse.body.id });

    expect(spouse.status).toBe(201);
    expect(created.status).toBe(201);
    expect(created.body.conjugueId).toBe(spouse.body.id);
  });

  it('rejects setting conjugueId to the member own id', async () => {
    const created = await request(app).post('/membros-ecc').send(validMembro);

    const res = await request(app)
      .put(`/membros-ecc/${created.body.id}`)
      .send({ conjugueId: created.body.id });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Cannot set self as spouse');
  });

  it('rejects an unknown conjugueId on create and update', async () => {
    const createRes = await request(app)
      .post('/membros-ecc')
      .send({ ...validMembro, conjugueId: UNKNOWN_ID });

    expect([400, 404]).toContain(createRes.status);

    const created = await request(app).post('/membros-ecc').send(validMembro);
    const updateRes = await request(app)
      .put(`/membros-ecc/${created.body.id}`)
      .send({ conjugueId: UNKNOWN_ID });

    expect([400, 404]).toContain(updateRes.status);
  });

  it.each([
    ['nome', 51],
    ['endereco', 51],
    ['telefone', 16],
  ])('rejects %s longer than its maximum', async (field, length) => {
    const res = await request(app)
      .post('/membros-ecc')
      .send({ ...validMembro, [field]: 'a'.repeat(length) });

    expect(res.status).toBe(400);
    expect(res.body.error.details[0].path).toBe(field);
  });

  it('returns 404 for an unknown member id', async () => {
    const res = await request(app).get(`/membros-ecc/${UNKNOWN_ID}`);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('MembroEcc not found');
  });
});
