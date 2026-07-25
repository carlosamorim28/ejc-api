import type { MembroEcc } from '@prisma/client';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type {
  CreateMembroEccInput,
  UpdateMembroEccInput,
} from '../schemas/membroEccSchema.js';

const NOT_FOUND = 'MembroEcc not found';

async function ensureConjugueExists(conjugueId?: string | null): Promise<void> {
  if (!conjugueId) {
    return;
  }

  const conjugue = await prisma.membroEcc.findUnique({
    where: { id: conjugueId },
  });

  if (!conjugue) {
    throw new AppError(404, 'Conjugue not found');
  }
}

export async function create(
  data: CreateMembroEccInput,
): Promise<MembroEcc> {
  await ensureConjugueExists(data.conjugueId);

  return prisma.membroEcc.create({ data });
}

export async function findAll(): Promise<MembroEcc[]> {
  return prisma.membroEcc.findMany({ orderBy: { createdAt: 'asc' } });
}

export async function findById(id: string): Promise<MembroEcc> {
  const membroEcc = await prisma.membroEcc.findUnique({ where: { id } });

  if (!membroEcc) {
    throw new AppError(404, NOT_FOUND);
  }

  return membroEcc;
}

export async function update(
  id: string,
  data: UpdateMembroEccInput,
): Promise<MembroEcc> {
  await findById(id);

  if (data.conjugueId === id) {
    throw new AppError(400, 'Cannot set self as spouse');
  }

  await ensureConjugueExists(data.conjugueId);

  return prisma.membroEcc.update({ where: { id }, data });
}

export async function remove(id: string): Promise<void> {
  await findById(id);

  await prisma.membroEcc.delete({ where: { id } });
}
