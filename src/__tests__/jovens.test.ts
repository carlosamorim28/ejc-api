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

describe('/jovens', () => {
  const app = getTestApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('runs the full create/list/read/update/delete cycle', async () => {
    const created = await request(app).post('/jovens').send(validJovem);

    expect(created.status).toBe(201);
    expect(created.body.id).toEqual(expect.any(String));
    expect(created.body.nome).toBe('Maria Silva');
    expect(created.body.dataNascimento).toContain('2005-03-20');

    const list = await request(app).get('/jovens');

    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(created.body.id);

    const found = await request(app).get(`/jovens/${created.body.id}`);

    expect(found.status).toBe(200);
    expect(found.body.apelido).toBe('Mari');

    const updated = await request(app)
      .put(`/jovens/${created.body.id}`)
      .send({ apelido: 'Mary', telefone: '11888887777' });

    expect(updated.status).toBe(200);
    expect(updated.body.apelido).toBe('Mary');
    expect(updated.body.telefone).toBe('11888887777');
    expect(updated.body.nome).toBe('Maria Silva');

    const removed = await request(app).delete(`/jovens/${created.body.id}`);

    expect(removed.status).toBe(204);
    expect(removed.body).toEqual({});

    const afterDelete = await request(app).get(`/jovens/${created.body.id}`);

    expect(afterDelete.status).toBe(404);
  });

  it('defaults role to MEMBRO when omitted', async () => {
    const res = await request(app).post('/jovens').send(validJovem);

    expect(res.status).toBe(201);
    expect(res.body.role).toBe('MEMBRO');
  });

  it('accepts role ADMINISTRADOR', async () => {
    const res = await request(app)
      .post('/jovens')
      .send({ ...validJovem, role: 'ADMINISTRADOR' });

    expect(res.status).toBe(201);
    expect(res.body.role).toBe('ADMINISTRADOR');
  });

  it('returns an empty list when there is no jovem', async () => {
    const res = await request(app).get('/jovens');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('rejects a payload without required fields', async () => {
    const res = await request(app).post('/jovens').send({});

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
    expect(res.body.error.details.map((d: { path: string }) => d.path)).toEqual(
      expect.arrayContaining([
        'nome',
        'telefone',
        'endereco',
        'nomePai',
        'nomeMae',
        'dataNascimento',
        'apelido',
      ]),
    );
  });

  it('rejects a nome longer than 100 characters', async () => {
    const res = await request(app)
      .post('/jovens')
      .send({ ...validJovem, nome: 'a'.repeat(101) });

    expect(res.status).toBe(400);
    expect(res.body.error.details[0].path).toBe('nome');
  });

  it('rejects a telefone longer than 15 characters', async () => {
    const res = await request(app)
      .post('/jovens')
      .send({ ...validJovem, telefone: '9'.repeat(16) });

    expect(res.status).toBe(400);
    expect(res.body.error.details[0].path).toBe('telefone');
  });

  it('accepts fields with exactly the max length', async () => {
    const res = await request(app)
      .post('/jovens')
      .send({
        ...validJovem,
        nome: 'a'.repeat(100),
        telefone: '9'.repeat(15),
        endereco: 'b'.repeat(50),
        nomePai: 'c'.repeat(50),
        nomeMae: 'd'.repeat(50),
        apelido: 'e'.repeat(50),
      });

    expect(res.status).toBe(201);
  });

  it('rejects an invalid role', async () => {
    const res = await request(app)
      .post('/jovens')
      .send({ ...validJovem, role: 'SUPERADMIN' });

    expect(res.status).toBe(400);
    expect(res.body.error.details[0].path).toBe('role');
  });

  it('rejects an invalid dataNascimento', async () => {
    const res = await request(app)
      .post('/jovens')
      .send({ ...validJovem, dataNascimento: 'not-a-date' });

    expect(res.status).toBe(400);
    expect(res.body.error.details[0].path).toBe('dataNascimento');
  });

  it('rejects an invalid id format', async () => {
    const res = await request(app).get('/jovens/abc');

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
  });

  it('returns 404 when reading an unknown id', async () => {
    const res = await request(app).get(`/jovens/${UNKNOWN_ID}`);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Jovem not found');
  });

  it('returns 404 when updating an unknown id', async () => {
    const res = await request(app)
      .put(`/jovens/${UNKNOWN_ID}`)
      .send({ apelido: 'Novo' });

    expect(res.status).toBe(404);
  });

  it('returns 404 when deleting an unknown id', async () => {
    const res = await request(app).delete(`/jovens/${UNKNOWN_ID}`);

    expect(res.status).toBe(404);
  });
});
