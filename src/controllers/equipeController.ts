import type { RequestHandler } from 'express';
import * as equipeService from '../services/equipeService.js';

type IdParams = { id: string };

export const create: RequestHandler = async (req, res, next) => {
  try {
    const equipe = await equipeService.create(req.body);
    res.status(201).json(equipe);
  } catch (err) {
    next(err);
  }
};

export const list: RequestHandler = async (_req, res, next) => {
  try {
    const equipes = await equipeService.findAll();
    res.status(200).json(equipes);
  } catch (err) {
    next(err);
  }
};

export const getById: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    const equipe = await equipeService.findById(req.params.id);
    res.status(200).json(equipe);
  } catch (err) {
    next(err);
  }
};

export const update: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    const equipe = await equipeService.update(req.params.id, req.body);
    res.status(200).json(equipe);
  } catch (err) {
    next(err);
  }
};

export const remove: RequestHandler<IdParams> = async (req, res, next) => {
  try {
    await equipeService.remove(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
