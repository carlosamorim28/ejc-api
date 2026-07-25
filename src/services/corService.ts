import type { Cor } from '@prisma/client';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type { CreateCorInput, UpdateCorInput } from '../schemas/corSchema.js';

const NOT_FOUND = 'Cor not found';

export async function create(data: CreateCorInput): Promise<Cor> {
  return prisma.cor.create({ data });
}

export async function findAll(): Promise<Cor[]> {
  return prisma.cor.findMany({ orderBy: { createdAt: 'asc' } });
}

export async function findById(id: string): Promise<Cor> {
  const cor = await prisma.cor.findUnique({ where: { id } });

  if (!cor) {
    throw new AppError(404, NOT_FOUND);
  }

  return cor;
}

export async function update(id: string, data: UpdateCorInput): Promise<Cor> {
  await findById(id);

  return prisma.cor.update({ where: { id }, data });
}

export async function remove(id: string): Promise<void> {
  await findById(id);

  await prisma.cor.delete({ where: { id } });
}
