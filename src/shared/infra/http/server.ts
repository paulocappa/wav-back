import 'reflect-metadata';
import 'dotenv/config';

import { container } from 'tsyringe';
import express, { Request, Response, NextFunction } from 'express';

import 'express-async-errors';
import '@shared/infra/typeorm';
import '@shared/container';

import AppError from '@shared/errors/AppError';
import FieldError from '@shared/errors/FieldError';

import uploadConfig from '@config/upload';

import Queue from './queue';
import routes from './routes';

const server = express();

server.use(express.json());

server.use(routes);

server.use('/file', express.static(uploadConfig.uploadsFolder));

server.use((err: Error, _: Request, res: Response, __: NextFunction) => {
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  if (err instanceof FieldError) {
    return res.status(err.statusCode).json({
      status: 'field_error',
      message: err.message,
      field: err.fieldWithError,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 'internal error',
    message: 'Internal Server Error',
  });
});

server.listen(3333, async () => {
  console.log('Server is running on port 3333');

  await container.resolve(Queue).process();
});
