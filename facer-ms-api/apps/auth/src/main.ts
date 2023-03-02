import { RmqService } from '@ktbz/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const rmqService = app.get<RmqService>(RmqService);
  useContainer(app.select(AuthModule), { fallbackOnErrors: true });

  app.connectMicroservice(rmqService.getOptions('AUTH'));
  app.useGlobalPipes(new ValidationPipe());
  await app.startAllMicroservices();
}
bootstrap();
