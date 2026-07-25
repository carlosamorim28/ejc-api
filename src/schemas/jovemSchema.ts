import { z } from 'zod';

export const idParamsSchema = z.object({
  id: z.uuid(),
});

export const createJovemSchema = z.object({
  nome: z.string().min(1).max(100),
  telefone: z.string().min(1).max(15),
  endereco: z.string().min(1).max(50),
  nomePai: z.string().min(1).max(50),
  nomeMae: z.string().min(1).max(50),
  dataNascimento: z.coerce.date(),
  apelido: z.string().min(1).max(50),
  role: z.enum(['MEMBRO', 'ADMINISTRADOR']).optional(),
});

export const updateJovemSchema = createJovemSchema.partial();

export type CreateJovemInput = z.infer<typeof createJovemSchema>;
export type UpdateJovemInput = z.infer<typeof updateJovemSchema>;
