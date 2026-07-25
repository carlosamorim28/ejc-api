import { Router } from 'express';
import * as corController from '../controllers/corController.js';
import { validate } from '../middlewares/validate.js';
import {
  createCorSchema,
  idParamsSchema,
  updateCorSchema,
} from '../schemas/corSchema.js';

export const coresRouter = Router();

coresRouter.post(
  '/',
  validate({ body: createCorSchema }),
  corController.create,
);

coresRouter.get('/', corController.list);

coresRouter.get(
  '/:id',
  validate({ params: idParamsSchema }),
  corController.getById,
);

coresRouter.put(
  '/:id',
  validate({ params: idParamsSchema, body: updateCorSchema }),
  corController.update,
);

coresRouter.delete(
  '/:id',
  validate({ params: idParamsSchema }),
  corController.remove,
);
