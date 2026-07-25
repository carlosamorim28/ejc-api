import { z } from 'zod';

export const idParamsSchema = z.object({
  id: z.uuid(),
});

export const createCorSchema = z.object({
  nome: z.string().min(1).max(50),
});

export const updateCorSchema = createCorSchema.partial();

export type CreateCorInput = z.infer<typeof createCorSchema>;
export type UpdateCorInput = z.infer<typeof updateCorSchema>;
