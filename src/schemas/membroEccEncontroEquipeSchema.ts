import { z } from 'zod';

export const idParamsSchema = z.object({
  id: z.uuid(),
});

export const createMembroEccEncontroEquipeSchema = z.object({
  membroEccId: z.uuid(),
  encontroId: z.uuid(),
  equipeId: z.uuid(),
  role: z.enum(['COORDENADOR', 'MEMBRO']).optional(),
});

export const updateMembroEccEncontroEquipeSchema =
  createMembroEccEncontroEquipeSchema.partial();

export type CreateMembroEccEncontroEquipeInput = z.infer<
  typeof createMembroEccEncontroEquipeSchema
>;
export type UpdateMembroEccEncontroEquipeInput = z.infer<
  typeof updateMembroEccEncontroEquipeSchema
>;
