import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { cleanupDatabase, disconnectDatabase, getTestApp } from './setup.js';

const UNKNOWN_ID = '00000000-0000-4000-8000-000000000000';

const validEquipe = {
  nome: 'Liturgia',
  descricao: 'Equipe responsavel pela liturgia do encontro',
};

describe('/equipes', () => {
  const app = getTestApp();

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('runs the full create/list/read/update/delete cycle', async () => {
    const created = await request(app).post('/equipes').send(validEquipe);

    expect(created.status).toBe(201);
    expect(created.body.id).toEqual(expect.any(String));
    expect(created.body.nome).toBe('Liturgia');
    expect(created.body.descricao).toBe(
      'Equipe responsavel pela liturgia do encontro',
    );

    const list = await request(app).get('/equipes');

    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(1);
    expect(list.body[0].id).toBe(created.body.id);

    const found = await request(app).get(`/equipes/${created.body.id}`);

    expect(found.status).toBe(200);
    expect(found.body.nome).toBe('Liturgia');

    const updated = await request(app)
      .put(`/equipes/${created.body.id}`)
      .send({ nome: 'Musica', descricao: 'Equipe de musica e canticos' });

    expect(updated.status).toBe(200);
    expect(updated.body.nome).toBe('Musica');
    expect(updated.body.descricao).toBe('Equipe de musica e canticos');

    const removed = await request(app).delete(`/equipes/${created.body.id}`);

    expect(removed.status).toBe(204);
    expect(removed.body).toEqual({});

    const afterDelete = await request(app).get(`/equipes/${created.body.id}`);

    expect(afterDelete.status).toBe(404);
  });

  it('accepts a partial update', async () => {
    const created = await request(app).post('/equipes').send(validEquipe);

    const updated = await request(app)
      .put(`/equipes/${created.body.id}`)
      .send({ nome: 'Cozinha' });

    expect(updated.status).toBe(200);
    expect(updated.body.nome).toBe('Cozinha');
    expect(updated.body.descricao).toBe(
      'Equipe responsavel pela liturgia do encontro',
    );
  });

  it('returns an empty list when there is no equipe', async () => {
    const res = await request(app).get('/equipes');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('rejects a payload without required fields', async () => {
    const res = await request(app).post('/equipes').send({});

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
    expect(res.body.error.details.map((d: { path: string }) => d.path)).toEqual(
      expect.arrayContaining(['nome', 'descricao']),
    );
  });

  it('rejects a nome longer than 50 characters', async () => {
    const res = await request(app)
      .post('/equipes')
      .send({ ...validEquipe, nome: 'a'.repeat(51) });

    expect(res.status).toBe(400);
    expect(res.body.error.details[0].path).toBe('nome');
  });

  it('rejects a descricao longer than 100 characters', async () => {
    const res = await request(app)
      .post('/equipes')
      .send({ ...validEquipe, descricao: 'a'.repeat(101) });

    expect(res.status).toBe(400);
    expect(res.body.error.details[0].path).toBe('descricao');
  });

  it('accepts fields with exactly the max length', async () => {
    const res = await request(app)
      .post('/equipes')
      .send({
        nome: 'a'.repeat(50),
        descricao: 'b'.repeat(100),
      });

    expect(res.status).toBe(201);
  });

  it('rejects an invalid id format', async () => {
    const res = await request(app).get('/equipes/abc');

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe('Validation failed');
  });

  it('returns 404 when reading an unknown id', async () => {
    const res = await request(app).get(`/equipes/${UNKNOWN_ID}`);

    expect(res.status).toBe(404);
    expect(res.body.error.message).toBe('Equipe not found');
  });

  it('returns 404 when updating an unknown id', async () => {
    const res = await request(app)
      .put(`/equipes/${UNKNOWN_ID}`)
      .send({ nome: 'Nova' });

    expect(res.status).toBe(404);
  });

  it('returns 404 when deleting an unknown id', async () => {
    const res = await request(app).delete(`/equipes/${UNKNOWN_ID}`);

    expect(res.status).toBe(404);
  });
});
