import { Router } from 'express';
import * as membroEccController from '../controllers/membroEccController.js';
import { validate } from '../middlewares/validate.js';
import {
  createMembroEccSchema,
  idParamsSchema,
  updateMembroEccSchema,
} from '../schemas/membroEccSchema.js';

export const membrosEccRouter = Router();

membrosEccRouter.post(
  '/',
  validate({ body: createMembroEccSchema }),
  membroEccController.create,
);

membrosEccRouter.get('/', membroEccController.list);

membrosEccRouter.get(
  '/:id',
  validate({ params: idParamsSchema }),
  membroEccController.getById,
);

membrosEccRouter.put(
  '/:id',
  validate({ params: idParamsSchema, body: updateMembroEccSchema }),
  membroEccController.update,
);

membrosEccRouter.delete(
  '/:id',
  validate({ params: idParamsSchema }),
  membroEccController.remove,
);
