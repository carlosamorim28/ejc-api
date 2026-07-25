import type { Express } from 'express';
import { createApp } from '../app.js';
import { prisma } from '../lib/prisma.js';

export function getTestApp(): Express {
  return createApp();
}

/**
 * Removes all rows in FK-safe order: junction/leaf tables first, then roots.
 */
export async function cleanupDatabase(): Promise<void> {
  await prisma.circulo.deleteMany();
  await prisma.jovemEncontroEquipe.deleteMany();
  await prisma.encontroEncontrista.deleteMany();
  await prisma.membroEccEncontroEquipe.deleteMany();
  await prisma.cor.deleteMany();
  await prisma.membroEcc.deleteMany();
  await prisma.equipe.deleteMany();
  await prisma.jovem.deleteMany();
  await prisma.encontro.deleteMany();
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
