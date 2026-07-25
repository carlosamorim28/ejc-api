import { Router } from 'express';
import * as jovemController from '../controllers/jovemController.js';
import { validate } from '../middlewares/validate.js';
import {
  createJovemSchema,
  idParamsSchema,
  updateJovemSchema,
} from '../schemas/jovemSchema.js';

export const jovensRouter = Router();

jovensRouter.post(
  '/',
  validate({ body: createJovemSchema }),
  jovemController.create,
);

jovensRouter.get('/', jovemController.list);

jovensRouter.get(
  '/:id',
  validate({ params: idParamsSchema }),
  jovemController.getById,
);

jovensRouter.put(
  '/:id',
  validate({ params: idParamsSchema, body: updateJovemSchema }),
  jovemController.update,
);

jovensRouter.delete(
  '/:id',
  validate({ params: idParamsSchema }),
  jovemController.remove,
);
