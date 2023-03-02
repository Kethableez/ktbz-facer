import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import {
	HttpGlobalExceptionFilter,
	RpcGlobalExceptionFilter,
} from './core/filters/exceptions.filter';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
	const app = await NestFactory.create(GatewayModule);
	const httpAdapterHost = app.get(HttpAdapterHost);
	useContainer(app.select(GatewayModule), { fallbackOnErrors: true });
	app.setGlobalPrefix('gateway');
	app.useGlobalPipes(new ValidationPipe());
	app.useGlobalFilters(
		new RpcGlobalExceptionFilter(httpAdapterHost),
		new HttpGlobalExceptionFilter(httpAdapterHost)
	);
	const configService = app.get(ConfigService);
	await app.listen(configService.get('PORT'));
}
bootstrap();
