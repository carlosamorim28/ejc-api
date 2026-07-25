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
  const cor = await request(app).post('/cores').send({ nome: 'Vermelho' });
  const jovem = await request(app).post('/jovens').send(validJovem);
  const encontro = await request(app)
    .post('/encontros')
    .send({ tema: 'Encontro de Jovens 2026', ano: '2026-07-15' });

  expect(cor.status).toBe(201);
  expect(jovem.status).toBe(201);
  expect(encontro.status).toBe(201);

  return {
    corId: cor.body.id as string,
    jovemId: jovem.body.id as string,
    encontroId: encontro.body.id as string,
    nome: 'Circulo A',
  };
}

describe('/circulos', () => {
  const app = getTestApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('creates a circulo', async () => {
    const fixtures = await createFixtures(app);

    const created = await request(app).post('/circulos').send(fixtures);

    expect(created.status).toBe(201);
    expect(created.body.id).toEqual(expect.any(String));
    expect(created.body.corId).toBe(fixtures.corId);
    expect(created.body.jovemId).toBe(fixtures.jovemId);
    expect(created.body.encontroId).toBe(fixtures.encontroId);
    expect(created.body.nome).toBe('Circulo A');
  });

  it('runs the full create/list/read/update/delete cycle', async () => {
    const fixtures = await createFixtures(app);
    const otherCor = await request(app).post('/cores').send({ nome: 'Azul' });
    const otherJovem = await request(app)
      .post('/jovens')
      .send({ ...validJovem, nome: 'Pedro Souza', apelido: 'Pedrinho' });

    expect(otherCor.status).toBe(201);
    expect(otherJovem.status).toBe(201);

    const created = await request(app).post('/circulos').send(fixtures);

    expect(created.status).toBe(201);

    const list = await request(app).get('/circulos');

    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(created.body.id);

    const found = await request(app).get(`/circulos/${created.body.id}`);

    expect(found.status).toBe(200);
    expect(found.body.jovemId).toBe(fixtures.jovemId);
    expect(found.body.nome).toBe('Circulo A');

    const updated = await request(app)
      .put(`/circulos/${created.body.id}`)
      .send({
        corId: otherCor.body.id,
        jovemId: otherJovem.body.id,
        nome: 'Circulo B',
      });

    expect(updated.status).toBe(200);
    expect(updated.body.corId).toBe(otherCor.body.id);
    expect(updated.body.jovemId).toBe(otherJovem.body.id);
    expect(updated.body.encontroId).toBe(fixtures.encontroId);
    expect(updated.body.nome).toBe('Circulo B');

    const removed = await request(app).delete(`/circulos/${created.body.id}`);

    expect(removed.status).toBe(204);
    expect(removed.body).toEqual({});

    const afterDelete = await request(app).get(
      `/circulos/${created.body.id}`,
    );

    expect(afterDelete.status).toBe(404);
  });

  it('rejects an invalid foreign key with 400', async () => {
    const fixtures = await createFixtures(app);

    const res = await request(app)
      .post('/circulos')
      .send({ ...fixtures, jovemId: UNKNOWN_ID });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Invalid reference');
  });

  it('rejects an invalid corId foreign key with 400', async () => {
    const fixtures = await createFixtures(app);

    const res = await request(app)
      .post('/circulos')
      .send({ ...fixtures, corId: UNKNOWN_ID });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Invalid reference');
  });

  it('rejects a duplicate jovemId+encontroId with 409', async () => {
    const fixtures = await createFixtures(app);
    const otherCor = await request(app).post('/cores').send({ nome: 'Verde' });

    expect(otherCor.status).toBe(201);

    const first = await request(app).post('/circulos').send(fixtures);
    const duplicate = await request(app)
      .post('/circulos')
      .send({
        ...fixtures,
        corId: otherCor.body.id,
        nome: 'Outro Circulo',
      });

    expect(first.status).toBe(201);
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error.message).toBe('Conflict');
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).get(`/circulos/${UNKNOWN_ID}`);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Circulo not found');
  });

  it('returns 404 when updating an unknown id', async () => {
    const fixtures = await createFixtures(app);

    const res = await request(app)
      .put(`/circulos/${UNKNOWN_ID}`)
      .send({ nome: fixtures.nome });

    expect(res.status).toBe(404);
  });

  it('returns 404 when deleting an unknown id', async () => {
    const res = await request(app).delete(`/circulos/${UNKNOWN_ID}`);

    expect(res.status).toBe(404);
  });

  it('rejects a payload without required fields', async () => {
    const res = await request(app).post('/circulos').send({});

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
    expect(res.body.error.details.map((d: { path: string }) => d.path)).toEqual(
      expect.arrayContaining(['corId', 'jovemId', 'encontroId', 'nome']),
    );
  });

  it('rejects a nome longer than 50 characters', async () => {
    const fixtures = await createFixtures(app);

    const res = await request(app)
      .post('/circulos')
      .send({ ...fixtures, nome: 'a'.repeat(51) });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
  });

  it('accepts a nome with exactly the max length', async () => {
    const fixtures = await createFixtures(app);

    const res = await request(app)
      .post('/circulos')
      .send({ ...fixtures, nome: 'a'.repeat(50) });

    expect(res.status).toBe(201);
    expect(res.body.nome).toHaveLength(50);
  });

  it('rejects an invalid id format', async () => {
    const res = await request(app).get('/circulos/abc');

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
  });

  it('rejects invalid uuid fields in body', async () => {
    const res = await request(app).post('/circulos').send({
      corId: 'not-a-uuid',
      jovemId: 'also-bad',
      encontroId: 'still-bad',
      nome: 'Circulo A',
    });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
  });
});
