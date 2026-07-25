import { Router } from 'express';
import * as circuloController from '../controllers/circuloController.js';
import { validate } from '../middlewares/validate.js';
import {
  createCirculoSchema,
  idParamsSchema,
  updateCirculoSchema,
} from '../schemas/circuloSchema.js';

export const circulosRouter = Router();

circulosRouter.post(
  '/',
  validate({ body: createCirculoSchema }),
  circuloController.create,
);

circulosRouter.get('/', circuloController.list);

circulosRouter.get(
  '/:id',
  validate({ params: idParamsSchema }),
  circuloController.getById,
);

circulosRouter.put(
  '/:id',
  validate({
    params: idParamsSchema,
    body: updateCirculoSchema,
  }),
  circuloController.update,
);

circulosRouter.delete(
  '/:id',
  validate({ params: idParamsSchema }),
  circuloController.remove,
);
