import type { Jovem } from '@prisma/client';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type {
  CreateJovemInput,
  UpdateJovemInput,
} from '../schemas/jovemSchema.js';

const NOT_FOUND = 'Jovem not found';

export async function create(data: CreateJovemInput): Promise<Jovem> {
  return prisma.jovem.create({ data });
}

export async function findAll(): Promise<Jovem[]> {
  return prisma.jovem.findMany({ orderBy: { createdAt: 'asc' } });
}

export async function findById(id: string): Promise<Jovem> {
  const jovem = await prisma.jovem.findUnique({ where: { id } });

  if (!jovem) {
    throw new AppError(404, NOT_FOUND);
  }

  return jovem;
}

export async function update(
  id: string,
  data: UpdateJovemInput,
): Promise<Jovem> {
  await findById(id);

  return prisma.jovem.update({ where: { id }, data });
}

export async function remove(id: string): Promise<void> {
  await findById(id);

  await prisma.jovem.delete({ where: { id } });
}
