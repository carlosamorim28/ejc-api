import { Router } from 'express';
import * as equipeController from '../controllers/equipeController.js';
import { validate } from '../middlewares/validate.js';
import {
  createEquipeSchema,
  idParamsSchema,
  updateEquipeSchema,
} from '../schemas/equipeSchema.js';

export const equipesRouter = Router();

equipesRouter.post(
  '/',
  validate({ body: createEquipeSchema }),
  equipeController.create,
);

equipesRouter.get('/', equipeController.list);

equipesRouter.get(
  '/:id',
  validate({ params: idParamsSchema }),
  equipeController.getById,
);

equipesRouter.put(
  '/:id',
  validate({ params: idParamsSchema, body: updateEquipeSchema }),
  equipeController.update,
);

equipesRouter.delete(
  '/:id',
  validate({ params: idParamsSchema }),
  equipeController.remove,
);
