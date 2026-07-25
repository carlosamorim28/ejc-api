import cors from 'cors';
import express, { type Express } from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { router } from './routes/index.js';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(router);
  app.use(errorHandler);

  return app;
}
