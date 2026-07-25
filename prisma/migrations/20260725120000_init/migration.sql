-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "JovemRole" AS ENUM ('MEMBRO', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "EquipePapelJovem" AS ENUM ('COORDENADOR', 'MEMBRO');

-- CreateEnum
CREATE TYPE "EquipePapelEcc" AS ENUM ('COORDENADOR', 'MEMBRO');

-- CreateTable
CREATE TABLE "Encontro" (
    "id" TEXT NOT NULL,
    "tema" VARCHAR(150) NOT NULL,
    "ano" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Encontro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jovem" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "telefone" VARCHAR(15) NOT NULL,
    "endereco" VARCHAR(50) NOT NULL,
    "nomePai" VARCHAR(50) NOT NULL,
    "nomeMae" VARCHAR(50) NOT NULL,
    "dataNascimento" DATE NOT NULL,
    "apelido" VARCHAR(50) NOT NULL,
    "role" "JovemRole" NOT NULL DEFAULT 'MEMBRO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jovem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipe" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "descricao" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JovemEncontroEquipe" (
    "id" TEXT NOT NULL,
    "jovemId" TEXT NOT NULL,
    "encontroId" TEXT NOT NULL,
    "equipeId" TEXT NOT NULL,
    "role" "EquipePapelJovem" NOT NULL DEFAULT 'MEMBRO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JovemEncontroEquipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EncontroEncontrista" (
    "id" TEXT NOT NULL,
    "jovemId" TEXT NOT NULL,
    "encontroId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EncontroEncontrista_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembroEcc" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "endereco" VARCHAR(50) NOT NULL,
    "telefone" VARCHAR(15) NOT NULL,
    "conjugueId" TEXT,
    "dataCasamento" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembroEcc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembroEccEncontroEquipe" (
    "id" TEXT NOT NULL,
    "membroEccId" TEXT NOT NULL,
    "encontroId" TEXT NOT NULL,
    "equipeId" TEXT NOT NULL,
    "role" "EquipePapelEcc" NOT NULL DEFAULT 'COORDENADOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembroEccEncontroEquipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cor" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Circulo" (
    "id" TEXT NOT NULL,
    "corId" TEXT NOT NULL,
    "jovemId" TEXT NOT NULL,
    "encontroId" TEXT NOT NULL,
    "nome" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Circulo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JovemEncontroEquipe_jovemId_encontroId_equipeId_key" ON "JovemEncontroEquipe"("jovemId", "encontroId", "equipeId");

-- CreateIndex
CREATE UNIQUE INDEX "EncontroEncontrista_jovemId_encontroId_key" ON "EncontroEncontrista"("jovemId", "encontroId");

-- CreateIndex
CREATE UNIQUE INDEX "MembroEccEncontroEquipe_membroEccId_encontroId_equipeId_key" ON "MembroEccEncontroEquipe"("membroEccId", "encontroId", "equipeId");

-- CreateIndex
CREATE UNIQUE INDEX "Circulo_jovemId_encontroId_key" ON "Circulo"("jovemId", "encontroId");

-- AddForeignKey
ALTER TABLE "JovemEncontroEquipe" ADD CONSTRAINT "JovemEncontroEquipe_jovemId_fkey" FOREIGN KEY ("jovemId") REFERENCES "Jovem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JovemEncontroEquipe" ADD CONSTRAINT "JovemEncontroEquipe_encontroId_fkey" FOREIGN KEY ("encontroId") REFERENCES "Encontro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JovemEncontroEquipe" ADD CONSTRAINT "JovemEncontroEquipe_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EncontroEncontrista" ADD CONSTRAINT "EncontroEncontrista_jovemId_fkey" FOREIGN KEY ("jovemId") REFERENCES "Jovem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EncontroEncontrista" ADD CONSTRAINT "EncontroEncontrista_encontroId_fkey" FOREIGN KEY ("encontroId") REFERENCES "Encontro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembroEcc" ADD CONSTRAINT "MembroEcc_conjugueId_fkey" FOREIGN KEY ("conjugueId") REFERENCES "MembroEcc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembroEccEncontroEquipe" ADD CONSTRAINT "MembroEccEncontroEquipe_membroEccId_fkey" FOREIGN KEY ("membroEccId") REFERENCES "MembroEcc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembroEccEncontroEquipe" ADD CONSTRAINT "MembroEccEncontroEquipe_encontroId_fkey" FOREIGN KEY ("encontroId") REFERENCES "Encontro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MembroEccEncontroEquipe" ADD CONSTRAINT "MembroEccEncontroEquipe_equipeId_fkey" FOREIGN KEY ("equipeId") REFERENCES "Equipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Circulo" ADD CONSTRAINT "Circulo_corId_fkey" FOREIGN KEY ("corId") REFERENCES "Cor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Circulo" ADD CONSTRAINT "Circulo_jovemId_fkey" FOREIGN KEY ("jovemId") REFERENCES "Jovem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Circulo" ADD CONSTRAINT "Circulo_encontroId_fkey" FOREIGN KEY ("encontroId") REFERENCES "Encontro"("id") ON DELETE CASCADE ON UPDATE CASCADE;

