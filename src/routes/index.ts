import { Router } from 'express';
import { circulosRouter } from './circulos.js';
import { coresRouter } from './cores.js';
import { encontroEncontristasRouter } from './encontro-encontristas.js';
import { encontrosRouter } from './encontros.js';
import { equipesRouter } from './equipes.js';
import { healthRouter } from './health.js';
import { jovemEncontroEquipesRouter } from './jovem-encontro-equipes.js';
import { jovensRouter } from './jovens.js';
import { membroEccEncontroEquipesRouter } from './membro-ecc-encontro-equipes.js';
import { membrosEccRouter } from './membros-ecc.js';

export const router = Router();

router.use('/health', healthRouter);
router.use('/encontros', encontrosRouter);
router.use('/jovens', jovensRouter);
router.use('/equipes', equipesRouter);
router.use('/cores', coresRouter);
router.use('/membros-ecc', membrosEccRouter);
router.use('/jovem-encontro-equipes', jovemEncontroEquipesRouter);
router.use('/encontro-encontristas', encontroEncontristasRouter);
router.use('/membro-ecc-encontro-equipes', membroEccEncontroEquipesRouter);
router.use('/circulos', circulosRouter);
