import type { MembroEccEncontroEquipe } from '@prisma/client';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type {
  CreateMembroEccEncontroEquipeInput,
  UpdateMembroEccEncontroEquipeInput,
} from '../schemas/membroEccEncontroEquipeSchema.js';

const NOT_FOUND = 'MembroEccEncontroEquipe not found';

export async function create(
  data: CreateMembroEccEncontroEquipeInput,
): Promise<MembroEccEncontroEquipe> {
  return prisma.membroEccEncontroEquipe.create({ data });
}

export async function findAll(): Promise<MembroEccEncontroEquipe[]> {
  return prisma.membroEccEncontroEquipe.findMany({
    orderBy: { createdAt: 'asc' },
  });
}

export async function findById(id: string): Promise<MembroEccEncontroEquipe> {
  const record = await prisma.membroEccEncontroEquipe.findUnique({
    where: { id },
  });

  if (!record) {
    throw new AppError(404, NOT_FOUND);
  }

  return record;
}

export async function update(
  id: string,
  data: UpdateMembroEccEncontroEquipeInput,
): Promise<MembroEccEncontroEquipe> {
  await findById(id);

  return prisma.membroEccEncontroEquipe.update({ where: { id }, data });
}

export async function remove(id: string): Promise<void> {
  await findById(id);

  await prisma.membroEccEncontroEquipe.delete({ where: { id } });
}
