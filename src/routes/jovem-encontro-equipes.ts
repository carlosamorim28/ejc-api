import { Router } from 'express';
import * as jovemEncontroEquipeController from '../controllers/jovemEncontroEquipeController.js';
import { validate } from '../middlewares/validate.js';
import {
  createJovemEncontroEquipeSchema,
  idParamsSchema,
  updateJovemEncontroEquipeSchema,
} from '../schemas/jovemEncontroEquipeSchema.js';

export const jovemEncontroEquipesRouter = Router();

jovemEncontroEquipesRouter.post(
  '/',
  validate({ body: createJovemEncontroEquipeSchema }),
  jovemEncontroEquipeController.create,
);

jovemEncontroEquipesRouter.get('/', jovemEncontroEquipeController.list);

jovemEncontroEquipesRouter.get(
  '/:id',
  validate({ params: idParamsSchema }),
  jovemEncontroEquipeController.getById,
);

jovemEncontroEquipesRouter.put(
  '/:id',
  validate({
    params: idParamsSchema,
    body: updateJovemEncontroEquipeSchema,
  }),
  jovemEncontroEquipeController.update,
);

jovemEncontroEquipesRouter.delete(
  '/:id',
  validate({ params: idParamsSchema }),
  jovemEncontroEquipeController.remove,
);
