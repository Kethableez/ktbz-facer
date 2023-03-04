import { RmqService } from '@ktbz/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { FileModule } from './file.module';

async function bootstrap() {
	const app = await NestFactory.create(FileModule);
	const rmqService = app.get<RmqService>(RmqService);
	useContainer(app.select(FileModule), { fallbackOnErrors: true });

	app.connectMicroservice(rmqService.getOptions('FILE'));
	app.useGlobalPipes(new ValidationPipe());
	await app.startAllMicroservices();
}
bootstrap();
