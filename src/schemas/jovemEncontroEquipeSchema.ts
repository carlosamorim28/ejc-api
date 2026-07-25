import { z } from 'zod';

export const idParamsSchema = z.object({
  id: z.uuid(),
});

export const createJovemEncontroEquipeSchema = z.object({
  jovemId: z.uuid(),
  encontroId: z.uuid(),
  equipeId: z.uuid(),
  role: z.enum(['COORDENADOR', 'MEMBRO']).optional(),
});

export const updateJovemEncontroEquipeSchema =
  createJovemEncontroEquipeSchema.partial();

export type CreateJovemEncontroEquipeInput = z.infer<
  typeof createJovemEncontroEquipeSchema
>;
export type UpdateJovemEncontroEquipeInput = z.infer<
  typeof updateJovemEncontroEquipeSchema
>;
