import { RmqService } from '@ktbz/common';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { MetricsModule } from './metrics.module';

async function bootstrap() {
	const app = await NestFactory.create(MetricsModule);
	const rmqService = app.get<RmqService>(RmqService);
	useContainer(app.select(MetricsModule), { fallbackOnErrors: true });

	app.connectMicroservice(rmqService.getOptions('METRICS'));
	app.useGlobalPipes(new ValidationPipe());

	await app.startAllMicroservices();
}
bootstrap();
