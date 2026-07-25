import { Router } from 'express';
import * as membroEccEncontroEquipeController from '../controllers/membroEccEncontroEquipeController.js';
import { validate } from '../middlewares/validate.js';
import {
  createMembroEccEncontroEquipeSchema,
  idParamsSchema,
  updateMembroEccEncontroEquipeSchema,
} from '../schemas/membroEccEncontroEquipeSchema.js';

export const membroEccEncontroEquipesRouter = Router();

membroEccEncontroEquipesRouter.post(
  '/',
  validate({ body: createMembroEccEncontroEquipeSchema }),
  membroEccEncontroEquipeController.create,
);

membroEccEncontroEquipesRouter.get('/', membroEccEncontroEquipeController.list);

membroEccEncontroEquipesRouter.get(
  '/:id',
  validate({ params: idParamsSchema }),
  membroEccEncontroEquipeController.getById,
);

membroEccEncontroEquipesRouter.put(
  '/:id',
  validate({
    params: idParamsSchema,
    body: updateMembroEccEncontroEquipeSchema,
  }),
  membroEccEncontroEquipeController.update,
);

membroEccEncontroEquipesRouter.delete(
  '/:id',
  validate({ params: idParamsSchema }),
  membroEccEncontroEquipeController.remove,
);
