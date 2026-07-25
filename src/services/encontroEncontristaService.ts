import type { EncontroEncontrista } from '@prisma/client';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type {
  CreateEncontroEncontristaInput,
  UpdateEncontroEncontristaInput,
} from '../schemas/encontroEncontristaSchema.js';

const NOT_FOUND = 'EncontroEncontrista not found';

export async function create(
  data: CreateEncontroEncontristaInput,
): Promise<EncontroEncontrista> {
  return prisma.encontroEncontrista.create({ data });
}

export async function findAll(): Promise<EncontroEncontrista[]> {
  return prisma.encontroEncontrista.findMany({
    orderBy: { createdAt: 'asc' },
  });
}

export async function findById(id: string): Promise<EncontroEncontrista> {
  const record = await prisma.encontroEncontrista.findUnique({
    where: { id },
  });

  if (!record) {
    throw new AppError(404, NOT_FOUND);
  }

  return record;
}

export async function update(
  id: string,
  data: UpdateEncontroEncontristaInput,
): Promise<EncontroEncontrista> {
  await findById(id);

  return prisma.encontroEncontrista.update({ where: { id }, data });
}

export async function remove(id: string): Promise<void> {
  await findById(id);

  await prisma.encontroEncontrista.delete({ where: { id } });
}
