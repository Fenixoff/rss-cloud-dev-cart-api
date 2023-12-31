import { NestFactory } from '@nestjs/core';
import { Callback, Context, Handler } from 'aws-lambda';

import helmet from 'helmet';
import serverlessExpress from '@codegenie/serverless-express';

import { AppModule } from './app.module';
import { AppDataSource } from './data-source';

const port = process.env.PORT || 4000;

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  await app.init();

  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
      throw err;
    });

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler = async (
  event: unknown,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
