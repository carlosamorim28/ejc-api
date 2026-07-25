# API EJC

CRUD HTTP para o domínio EJC.

**Stack:** Express + Prisma + PostgreSQL + Docker

## Quick start (Docker)

```bash
cd api
docker compose up --build
```

- API: http://localhost:3000
- Postgres no host: porta **5433** → 5432 no container (evita conflito com Postgres local)

## Variáveis de ambiente

```bash
cp .env.example .env
```

| Variável       | Descrição                                      |
|----------------|------------------------------------------------|
| `DATABASE_URL` | Connection string PostgreSQL                   |
| `PORT`         | Porta HTTP (padrão `3000`)                     |

Exemplo em `.env.example`: `postgresql://ejc:ejc@localhost:5433/ejc?schema=public`

## Endpoints

| Método | Path | Status |
|--------|------|--------|
| GET | `/health` | 200 |

CRUD em cada recurso abaixo:

| Recurso |
|---------|
| `/encontros` |
| `/jovens` |
| `/equipes` |
| `/cores` |
| `/membros-ecc` |
| `/jovem-encontro-equipes` |
| `/encontro-encontristas` |
| `/membro-ecc-encontro-equipes` |
| `/circulos` |

| Método | Path | Status |
|--------|------|--------|
| POST | `/recurso` | 201 |
| GET | `/recurso` | 200 |
| GET | `/recurso/:id` | 200 |
| PUT | `/recurso/:id` | 200 |
| DELETE | `/recurso/:id` | 204 |

## Desenvolvimento local

Requer PostgreSQL acessível (ex.: `docker compose up -d db`).

```bash
cp .env.example .env   # DATABASE_URL em localhost:5433
npm install
npx prisma migrate deploy   # ou npm run prisma:migrate
npm run dev
```

## Testes

```bash
docker compose up -d db
# garantir DATABASE_URL apontando para localhost:5433
npm test
```
