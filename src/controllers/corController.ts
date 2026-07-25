import type { RequestHandler } from 'express';
import * as corService from '../services/corService.js';

type IdParams = { id: string };

export const create: RequestHandler = async (req, res, next) => {
  try {
    const cor = await corService.create(req.body);
    res.status(201).json(cor);
  } catch (err) {
    next(err);
  }
};

export const list: RequestHandler = async (_req, res, next) => {
  try {
    const cores = await corService.findAll();
    res.status(200).json(cores);
  } catch (err) {
    next(err);
  }
};

export const getById: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    const cor = await corService.findById(req.params.id);
    res.status(200).json(cor);
  } catch (err) {
    next(err);
  }
};

export const update: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    const cor = await corService.update(req.params.id, req.body);
    res.status(200).json(cor);
  } catch (err) {
    next(err);
  }
};

export const remove: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    await corService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
