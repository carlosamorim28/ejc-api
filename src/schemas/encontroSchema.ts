import { z } from 'zod';

export const idParamsSchema = z.object({
  id: z.uuid(),
});

export const createEncontroSchema = z.object({
  tema: z.string().min(1).max(150),
  ano: z.coerce.date(),
});

export const updateEncontroSchema = createEncontroSchema.partial();

export type CreateEncontroInput = z.infer<typeof createEncontroSchema>;
export type UpdateEncontroInput = z.infer<typeof updateEncontroSchema>;
