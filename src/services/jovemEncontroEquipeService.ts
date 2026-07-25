import type { JovemEncontroEquipe } from '@prisma/client';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type {
  CreateJovemEncontroEquipeInput,
  UpdateJovemEncontroEquipeInput,
} from '../schemas/jovemEncontroEquipeSchema.js';

const NOT_FOUND = 'JovemEncontroEquipe not found';

export async function create(
  data: CreateJovemEncontroEquipeInput,
): Promise<JovemEncontroEquipe> {
  return prisma.jovemEncontroEquipe.create({ data });
}

export async function findAll(): Promise<JovemEncontroEquipe[]> {
  return prisma.jovemEncontroEquipe.findMany({
    orderBy: { createdAt: 'asc' },
  });
}

export async function findById(id: string): Promise<JovemEncontroEquipe> {
  const record = await prisma.jovemEncontroEquipe.findUnique({
    where: { id },
  });

  if (!record) {
    throw new AppError(404, NOT_FOUND);
  }

  return record;
}

export async function update(
  id: string,
  data: UpdateJovemEncontroEquipeInput,
): Promise<JovemEncontroEquipe> {
  await findById(id);

  return prisma.jovemEncontroEquipe.update({ where: { id }, data });
}

export async function remove(id: string): Promise<void> {
  await findById(id);

  await prisma.jovemEncontroEquipe.delete({ where: { id } });
}
