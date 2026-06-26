import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { configure as serverlessExpress } from '@vendia/serverless-express';

let server;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // კონფიგურაციები
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(','),
    credentials: true,
  });

  await app.init();
  return app.getHttpAdapter().getInstance();
}

export const handler = async (event: any, context: any, callback: any) => {
  if (!server) {
    const expressApp = await bootstrap();
    server = serverlessExpress({ app: expressApp });
  }
  return server(event, context, callback);
};

// ადგილობრივი გაშვებისთვის (npm run start)
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((app) => {
    app.listen(process.env.PORT ?? 3000);
  });
}
