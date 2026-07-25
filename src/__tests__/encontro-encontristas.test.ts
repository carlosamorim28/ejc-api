import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { cleanupDatabase, disconnectDatabase, getTestApp } from './setup.js';

const UNKNOWN_ID = '00000000-0000-4000-8000-000000000000';

const validJovem = {
  nome: 'Maria Silva',
  telefone: '11999998888',
  endereco: 'Rua das Flores, 100',
  nomePai: 'Jose Silva',
  nomeMae: 'Ana Silva',
  dataNascimento: '2005-03-20',
  apelido: 'Mari',
};

async function createFixtures(app: ReturnType<typeof getTestApp>) {
  const jovem = await request(app).post('/jovens').send(validJovem);
  const encontro = await request(app)
    .post('/encontros')
    .send({ tema: 'Encontro de Jovens 2026', ano: '2026-07-15' });

  expect(jovem.status).toBe(201);
  expect(encontro.status).toBe(201);

  return {
    jovemId: jovem.body.id as string,
    encontroId: encontro.body.id as string,
  };
}

describe('/encontro-encontristas', () => {
  const app = getTestApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('creates an encontro-encontrista link', async () => {
    const fixtures = await createFixtures(app);

    const created = await request(app)
      .post('/encontro-encontristas')
      .send(fixtures);

    expect(created.status).toBe(201);
    expect(created.body.id).toEqual(expect.any(String));
    expect(created.body.jovemId).toBe(fixtures.jovemId);
    expect(created.body.encontroId).toBe(fixtures.encontroId);
  });

  it('runs the full create/list/read/update/delete cycle', async () => {
    const fixtures = await createFixtures(app);
    const otherJovem = await request(app)
      .post('/jovens')
      .send({ ...validJovem, nome: 'Pedro Souza', apelido: 'Pedrinho' });

    expect(otherJovem.status).toBe(201);

    const created = await request(app)
      .post('/encontro-encontristas')
      .send(fixtures);

    expect(created.status).toBe(201);

    const list = await request(app).get('/encontro-encontristas');

    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(created.body.id);

    const found = await request(app).get(
      `/encontro-encontristas/${created.body.id}`,
    );

    expect(found.status).toBe(200);
    expect(found.body.jovemId).toBe(fixtures.jovemId);

    const updated = await request(app)
      .put(`/encontro-encontristas/${created.body.id}`)
      .send({ jovemId: otherJovem.body.id });

    expect(updated.status).toBe(200);
    expect(updated.body.jovemId).toBe(otherJovem.body.id);
    expect(updated.body.encontroId).toBe(fixtures.encontroId);

    const removed = await request(app).delete(
      `/encontro-encontristas/${created.body.id}`,
    );

    expect(removed.status).toBe(204);
    expect(removed.body).toEqual({});

    const afterDelete = await request(app).get(
      `/encontro-encontristas/${created.body.id}`,
    );

    expect(afterDelete.status).toBe(404);
  });

  it('rejects an invalid foreign key with 400', async () => {
    const fixtures = await createFixtures(app);

    const res = await request(app)
      .post('/encontro-encontristas')
      .send({ ...fixtures, jovemId: UNKNOWN_ID });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Invalid reference');
  });

  it('rejects a duplicate jovemId+encontroId with 409', async () => {
    const fixtures = await createFixtures(app);

    const first = await request(app)
      .post('/encontro-encontristas')
      .send(fixtures);
    const duplicate = await request(app)
      .post('/encontro-encontristas')
      .send(fixtures);

    expect(first.status).toBe(201);
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error.message).toBe('Conflict');
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).get(`/encontro-encontristas/${UNKNOWN_ID}`);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('EncontroEncontrista not found');
  });

  it('returns 404 when updating an unknown id', async () => {
    const fixtures = await createFixtures(app);

    const res = await request(app)
      .put(`/encontro-encontristas/${UNKNOWN_ID}`)
      .send({ jovemId: fixtures.jovemId });

    expect(res.status).toBe(404);
  });

  it('returns 404 when deleting an unknown id', async () => {
    const res = await request(app).delete(
      `/encontro-encontristas/${UNKNOWN_ID}`,
    );

    expect(res.status).toBe(404);
  });

  it('rejects a payload without required fields', async () => {
    const res = await request(app).post('/encontro-encontristas').send({});

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
    expect(res.body.error.details.map((d: { path: string }) => d.path)).toEqual(
      expect.arrayContaining(['jovemId', 'encontroId']),
    );
  });

  it('rejects an invalid id format', async () => {
    const res = await request(app).get('/encontro-encontristas/abc');

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
  });

  it('rejects invalid uuid fields in body', async () => {
    const res = await request(app)
      .post('/encontro-encontristas')
      .send({
        jovemId: 'not-a-uuid',
        encontroId: 'also-bad',
      });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
  });
});
