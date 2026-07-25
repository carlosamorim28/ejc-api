import type { RequestHandler } from 'express';
import * as membroEccService from '../services/membroEccService.js';

type IdParams = { id: string };

export const create: RequestHandler = async (req, res, next) => {
  try {
    const membroEcc = await membroEccService.create(req.body);
    res.status(201).json(membroEcc);
  } catch (err) {
    next(err);
  }
};

export const list: RequestHandler = async (_req, res, next) => {
  try {
    const membrosEcc = await membroEccService.findAll();
    res.status(200).json(membrosEcc);
  } catch (err) {
    next(err);
  }
};

export const getById: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    const membroEcc = await membroEccService.findById(req.params.id);
    res.status(200).json(membroEcc);
  } catch (err) {
    next(err);
  }
};

export const update: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    const membroEcc = await membroEccService.update(req.params.id, req.body);
    res.status(200).json(membroEcc);
  } catch (err) {
    next(err);
  }
};

export const remove: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    await membroEccService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
