import type { RequestHandler } from 'express';
import * as jovemService from '../services/jovemService.js';

type IdParams = { id: string };

export const create: RequestHandler = async (req, res, next) => {
  try {
    const jovem = await jovemService.create(req.body);
    res.status(201).json(jovem);
  } catch (err) {
    next(err);
  }
};

export const list: RequestHandler = async (_req, res, next) => {
  try {
    const jovens = await jovemService.findAll();
    res.status(200).json(jovens);
  } catch (err) {
    next(err);
  }
};

export const getById: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    const jovem = await jovemService.findById(req.params.id);
    res.status(200).json(jovem);
  } catch (err) {
    next(err);
  }
};

export const update: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    const jovem = await jovemService.update(req.params.id, req.body);
    res.status(200).json(jovem);
  } catch (err) {
    next(err);
  }
};

export const remove: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    await jovemService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
