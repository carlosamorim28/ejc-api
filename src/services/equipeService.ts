import type { Equipe } from '@prisma/client';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type {
  CreateEquipeInput,
  UpdateEquipeInput,
} from '../schemas/equipeSchema.js';

const NOT_FOUND = 'Equipe not found';

export async function create(data: CreateEquipeInput): Promise<Equipe> {
  return prisma.equipe.create({ data });
}

export async function findAll(): Promise<Equipe[]> {
  return prisma.equipe.findMany({ orderBy: { createdAt: 'asc' } });
}

export async function findById(id: string): Promise<Equipe> {
  const equipe = await prisma.equipe.findUnique({ where: { id } });

  if (!equipe) {
    throw new AppError(404, NOT_FOUND);
  }

  return equipe;
}

export async function update(
  id: string,
  data: UpdateEquipeInput,
): Promise<Equipe> {
  await findById(id);

  return prisma.equipe.update({ where: { id }, data });
}

export async function remove(id: string): Promise<void> {
  await findById(id);

  await prisma.equipe.delete({ where: { id } });
}
