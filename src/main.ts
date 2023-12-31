import { NestFactory } from '@nestjs/core';
import { exit } from 'process';

import helmet from 'helmet';

import { AppModule } from './app.module';
import { AppDataSource } from './data-source';

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await AppDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization', err);
      exit(1);
    });

  await app.listen(port);
}

bootstrap().then(() => {
  console.log('App is running on %s port', port);
});
