import { z } from 'zod';

export const idParamsSchema = z.object({
  id: z.uuid(),
});

export const createEquipeSchema = z.object({
  nome: z.string().min(1).max(50),
  descricao: z.string().min(1).max(100),
});

export const updateEquipeSchema = createEquipeSchema.partial();

export type CreateEquipeInput = z.infer<typeof createEquipeSchema>;
export type UpdateEquipeInput = z.infer<typeof updateEquipeSchema>;
