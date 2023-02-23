import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { config } from 'rxjs';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	// app.useGlobalPipes(new ValidationPipe());
	app.setGlobalPrefix('api/v1');
	app.use(cookieParser());
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	app.enableCors({
		origin: ['http://localhost:4200'],
	});

	const swaggerConf = new DocumentBuilder()
		.setTitle('Facer API')
		.setDescription('Rest api for Facer')
		.setVersion('1.0')
		.addTag('user')
		.addTag('auth')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConf);
	SwaggerModule.setup('api', app, document);
	await app.listen(3000);
}
bootstrap();
