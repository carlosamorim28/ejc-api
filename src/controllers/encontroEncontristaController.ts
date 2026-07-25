import type { RequestHandler } from 'express';
import * as encontroEncontristaService from '../services/encontroEncontristaService.js';

type IdParams = { id: string };

export const create: RequestHandler = async (req, res, next) => {
  try {
    const record = await encontroEncontristaService.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};

export const list: RequestHandler = async (_req, res, next) => {
  try {
    const records = await encontroEncontristaService.findAll();
    res.status(200).json(records);
  } catch (err) {
    next(err);
  }
};

export const getById: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    const record = await encontroEncontristaService.findById(req.params.id);
    res.status(200).json(record);
  } catch (err) {
    next(err);
  }
};

export const update: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    const record = await encontroEncontristaService.update(
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
    await encontroEncontristaService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
