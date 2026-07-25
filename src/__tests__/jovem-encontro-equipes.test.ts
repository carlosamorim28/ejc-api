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
  const equipe = await request(app)
    .post('/equipes')
    .send({
      nome: 'Liturgia',
      descricao: 'Equipe responsavel pela liturgia do encontro',
    });

  expect(jovem.status).toBe(201);
  expect(encontro.status).toBe(201);
  expect(equipe.status).toBe(201);

  return {
    jovemId: jovem.body.id as string,
    encontroId: encontro.body.id as string,
    equipeId: equipe.body.id as string,
  };
}

describe('/jovem-encontro-equipes', () => {
  const app = getTestApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('creates with default role MEMBRO', async () => {
    const fixtures = await createFixtures(app);

    const created = await request(app)
      .post('/jovem-encontro-equipes')
      .send(fixtures);

    expect(created.status).toBe(201);
    expect(created.body.id).toEqual(expect.any(String));
    expect(created.body.jovemId).toBe(fixtures.jovemId);
    expect(created.body.encontroId).toBe(fixtures.encontroId);
    expect(created.body.equipeId).toBe(fixtures.equipeId);
    expect(created.body.role).toBe('MEMBRO');
  });

  it('creates with role COORDENADOR', async () => {
    const fixtures = await createFixtures(app);

    const created = await request(app)
      .post('/jovem-encontro-equipes')
      .send({ ...fixtures, role: 'COORDENADOR' });

    expect(created.status).toBe(201);
    expect(created.body.role).toBe('COORDENADOR');
  });

  it('runs the full create/list/read/update/delete cycle', async () => {
    const fixtures = await createFixtures(app);

    const created = await request(app)
      .post('/jovem-encontro-equipes')
      .send(fixtures);

    expect(created.status).toBe(201);

    const list = await request(app).get('/jovem-encontro-equipes');

    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(created.body.id);

    const found = await request(app).get(
      `/jovem-encontro-equipes/${created.body.id}`,
    );

    expect(found.status).toBe(200);
    expect(found.body.role).toBe('MEMBRO');

    const updated = await request(app)
      .put(`/jovem-encontro-equipes/${created.body.id}`)
      .send({ role: 'COORDENADOR' });

    expect(updated.status).toBe(200);
    expect(updated.body.role).toBe('COORDENADOR');

    const removed = await request(app).delete(
      `/jovem-encontro-equipes/${created.body.id}`,
    );

    expect(removed.status).toBe(204);
    expect(removed.body).toEqual({});

    const afterDelete = await request(app).get(
      `/jovem-encontro-equipes/${created.body.id}`,
    );

    expect(afterDelete.status).toBe(404);
  });

  it('rejects an invalid foreign key with 400', async () => {
    const fixtures = await createFixtures(app);

    const res = await request(app)
      .post('/jovem-encontro-equipes')
      .send({ ...fixtures, jovemId: UNKNOWN_ID });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Invalid reference');
  });

  it('rejects a duplicate jovemId+encontroId+equipeId with 409', async () => {
    const fixtures = await createFixtures(app);

    const first = await request(app)
      .post('/jovem-encontro-equipes')
      .send(fixtures);
    const duplicate = await request(app)
      .post('/jovem-encontro-equipes')
      .send(fixtures);

    expect(first.status).toBe(201);
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error.message).toBe('Conflict');
  });

  it('returns 404 for an unknown id', async () => {
    const res = await request(app).get(
      `/jovem-encontro-equipes/${UNKNOWN_ID}`,
    );

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('JovemEncontroEquipe not found');
  });

  it('returns 404 when updating an unknown id', async () => {
    const res = await request(app)
      .put(`/jovem-encontro-equipes/${UNKNOWN_ID}`)
      .send({ role: 'COORDENADOR' });

    expect(res.status).toBe(404);
  });

  it('returns 404 when deleting an unknown id', async () => {
    const res = await request(app).delete(
      `/jovem-encontro-equipes/${UNKNOWN_ID}`,
    );

    expect(res.status).toBe(404);
  });

  it('rejects a payload without required fields', async () => {
    const res = await request(app).post('/jovem-encontro-equipes').send({});

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
    expect(res.body.error.details.map((d: { path: string }) => d.path)).toEqual(
      expect.arrayContaining(['jovemId', 'encontroId', 'equipeId']),
    );
  });

  it('rejects an invalid role value', async () => {
    const fixtures = await createFixtures(app);

    const res = await request(app)
      .post('/jovem-encontro-equipes')
      .send({ ...fixtures, role: 'ADMIN' });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
    expect(res.body.error.details[0].path).toBe('role');
  });

  it('rejects an invalid id format', async () => {
    const res = await request(app).get('/jovem-encontro-equipes/abc');

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
  });

  it('rejects invalid uuid fields in body', async () => {
    const res = await request(app)
      .post('/jovem-encontro-equipes')
      .send({
        jovemId: 'not-a-uuid',
        encontroId: 'also-bad',
        equipeId: 'nope',
      });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
  });
});
