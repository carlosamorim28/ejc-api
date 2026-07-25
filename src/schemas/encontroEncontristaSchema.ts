import { z } from 'zod';

export const idParamsSchema = z.object({
  id: z.uuid(),
});

export const createEncontroEncontristaSchema = z.object({
  jovemId: z.uuid(),
  encontroId: z.uuid(),
});

export const updateEncontroEncontristaSchema =
  createEncontroEncontristaSchema.partial();

export type CreateEncontroEncontristaInput = z.infer<
  typeof createEncontroEncontristaSchema
>;
export type UpdateEncontroEncontristaInput = z.infer<
  typeof updateEncontroEncontristaSchema
>;
