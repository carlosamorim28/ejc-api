import { Router } from 'express';
import * as encontroController from '../controllers/encontroController.js';
import { validate } from '../middlewares/validate.js';
import {
  createEncontroSchema,
  idParamsSchema,
  updateEncontroSchema,
} from '../schemas/encontroSchema.js';

export const encontrosRouter = Router();

encontrosRouter.post(
  '/',
  validate({ body: createEncontroSchema }),
  encontroController.create,
);

encontrosRouter.get('/', encontroController.list);

encontrosRouter.get(
  '/:id',
  validate({ params: idParamsSchema }),
  encontroController.getById,
);

encontrosRouter.put(
  '/:id',
  validate({ params: idParamsSchema, body: updateEncontroSchema }),
  encontroController.update,
);

encontrosRouter.delete(
  '/:id',
  validate({ params: idParamsSchema }),
  encontroController.remove,
);
