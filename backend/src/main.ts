import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const config = app.get(ConfigService);
  app.use(helmet());
  app.use(json({ limit: '16kb' }));
  app.enableCors({ origin: config.getOrThrow<string>('FRONTEND_ORIGIN'), methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'] });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, validationError: { target: false, value: false } }));
  app.enableShutdownHooks();
  await app.listen(config.getOrThrow<number>('PORT'));
}

bootstrap().catch(() => {
  console.error('Falha ao iniciar a API. Verifique a configuracao e a disponibilidade do MySQL.');
  process.exitCode = 1;
});
