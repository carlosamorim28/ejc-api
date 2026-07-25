import type { RequestHandler } from 'express';
import * as membroEccEncontroEquipeService from '../services/membroEccEncontroEquipeService.js';

type IdParams = { id: string };

export const create: RequestHandler = async (req, res, next) => {
  try {
    const record = await membroEccEncontroEquipeService.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};

export const list: RequestHandler = async (_req, res, next) => {
  try {
    const records = await membroEccEncontroEquipeService.findAll();
    res.status(200).json(records);
  } catch (err) {
    next(err);
  }
};

export const getById: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    const record = await membroEccEncontroEquipeService.findById(req.params.id);
    res.status(200).json(record);
  } catch (err) {
    next(err);
  }
};

export const update: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    const record = await membroEccEncontroEquipeService.update(
      req.params.id,
      req.body,
    );
    res.status(200).json(record);
  } catch (err) {
    next(err);
  }
};

export const remove: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    await membroEccEncontroEquipeService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
