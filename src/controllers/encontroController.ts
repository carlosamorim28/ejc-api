import type { RequestHandler } from 'express';
import * as encontroService from '../services/encontroService.js';

type IdParams = { id: string };

export const create: RequestHandler = async (req, res, next) => {
  try {
    const encontro = await encontroService.create(req.body);
    res.status(201).json(encontro);
  } catch (err) {
    next(err);
  }
};

export const list: RequestHandler = async (_req, res, next) => {
  try {
    const encontros = await encontroService.findAll();
    res.status(200).json(encontros);
  } catch (err) {
    next(err);
  }
};

export const getById: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    const encontro = await encontroService.findById(req.params.id);
    res.status(200).json(encontro);
  } catch (err) {
    next(err);
  }
};

export const update: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    const encontro = await encontroService.update(req.params.id, req.body);
    res.status(200).json(encontro);
  } catch (err) {
    next(err);
  }
};

export const remove: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    await encontroService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
