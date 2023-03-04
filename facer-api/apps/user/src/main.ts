import { RmqService } from '@ktbz/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { UserModule } from './user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  const rmqService = app.get<RmqService>(RmqService);
  useContainer(app.select(UserModule), { fallbackOnErrors: true });

  app.connectMicroservice(rmqService.getOptions('USER'));
  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
}
bootstrap();
