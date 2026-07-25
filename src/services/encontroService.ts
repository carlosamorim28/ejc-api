import type { Encontro } from '@prisma/client';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type {
  CreateEncontroInput,
  UpdateEncontroInput,
} from '../schemas/encontroSchema.js';

const NOT_FOUND = 'Encontro not found';

export async function create(data: CreateEncontroInput): Promise<Encontro> {
  return prisma.encontro.create({ data });
}

export async function findAll(): Promise<Encontro[]> {
  return prisma.encontro.findMany({ orderBy: { createdAt: 'asc' } });
}

export async function findById(id: string): Promise<Encontro> {
  const encontro = await prisma.encontro.findUnique({ where: { id } });

  if (!encontro) {
    throw new AppError(404, NOT_FOUND);
  }

  return encontro;
}

export async function update(
  id: string,
  data: UpdateEncontroInput,
): Promise<Encontro> {
  await findById(id);

  return prisma.encontro.update({ where: { id }, data });
}

export async function remove(id: string): Promise<void> {
  await findById(id);

  await prisma.encontro.delete({ where: { id } });
}
