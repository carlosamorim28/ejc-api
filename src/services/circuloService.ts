import type { Circulo } from '@prisma/client';
import { AppError } from '../lib/errors.js';
import { prisma } from '../lib/prisma.js';
import type {
  CreateCirculoInput,
  UpdateCirculoInput,
} from '../schemas/circuloSchema.js';

const NOT_FOUND = 'Circulo not found';

export async function create(data: CreateCirculoInput): Promise<Circulo> {
  return prisma.circulo.create({ data });
}

export async function findAll(): Promise<Circulo[]> {
  return prisma.circulo.findMany({
    orderBy: { createdAt: 'asc' },
  });
}

export async function findById(id: string): Promise<Circulo> {
  const record = await prisma.circulo.findUnique({
    where: { id },
  });

  if (!record) {
    throw new AppError(404, NOT_FOUND);
  }

  return record;
}

export async function update(
  id: string,
  data: UpdateCirculoInput,
): Promise<Circulo> {
  await findById(id);

  return prisma.circulo.update({ where: { id }, data });
}

export async function remove(id: string): Promise<void> {
  await findById(id);

  await prisma.circulo.delete({ where: { id } });
}
