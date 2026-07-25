import { z } from 'zod';

export const idParamsSchema = z.object({
  id: z.uuid(),
});

export const createCirculoSchema = z.object({
  corId: z.uuid(),
  jovemId: z.uuid(),
  encontroId: z.uuid(),
  nome: z.string().min(1).max(50),
});

export const updateCirculoSchema = createCirculoSchema.partial();

export type CreateCirculoInput = z.infer<typeof createCirculoSchema>;
export type UpdateCirculoInput = z.infer<typeof updateCirculoSchema>;
