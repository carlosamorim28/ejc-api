import { Router } from 'express';
import * as encontroEncontristaController from '../controllers/encontroEncontristaController.js';
import { validate } from '../middlewares/validate.js';
import {
  createEncontroEncontristaSchema,
  idParamsSchema,
  updateEncontroEncontristaSchema,
} from '../schemas/encontroEncontristaSchema.js';

export const encontroEncontristasRouter = Router();

encontroEncontristasRouter.post(
  '/',
  validate({ body: createEncontroEncontristaSchema }),
  encontroEncontristaController.create,
);

encontroEncontristasRouter.get('/', encontroEncontristaController.list);

encontroEncontristasRouter.get(
  '/:id',
  validate({ params: idParamsSchema }),
  encontroEncontristaController.getById,
);

encontroEncontristasRouter.put(
  '/:id',
  validate({
    params: idParamsSchema,
    body: updateEncontroEncontristaSchema,
  }),
  encontroEncontristaController.update,
);

encontroEncontristasRouter.delete(
  '/:id',
  validate({ params: idParamsSchema }),
  encontroEncontristaController.remove,
);
