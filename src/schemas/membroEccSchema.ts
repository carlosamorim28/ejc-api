import { z } from 'zod';

export const idParamsSchema = z.object({
  id: z.uuid(),
});

export const createMembroEccSchema = z.object({
  nome: z.string().min(1).max(50),
  endereco: z.string().min(1).max(50),
  telefone: z.string().min(1).max(15),
  conjugueId: z.uuid().nullable().optional(),
  dataCasamento: z.coerce.date().nullable().optional(),
});

export const updateMembroEccSchema = createMembroEccSchema.partial();

export type CreateMembroEccInput = z.infer<typeof createMembroEccSchema>;
export type UpdateMembroEccInput = z.infer<typeof updateMembroEccSchema>;
