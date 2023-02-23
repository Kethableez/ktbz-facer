import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { config } from 'rxjs';
import { AppModule } from './app.module';

async function setupApp() {
	const app = await NestFactory.create(AppModule);
	useContainer(app.select(AppModule), { fallbackOnErrors: true });
	app.useGlobalPipes(new ValidationPipe());
	app.setGlobalPrefix('api/v1');
	app.use(cookieParser());
	app.enableCors({
		origin: ['http://localhost:4200'],
	});

	return app;
}

function setupSwagger(app: INestApplication) {
	const swaggerConf = new DocumentBuilder()
		.setTitle('Facer API')
		.setDescription('Rest api for Facer')
		.setVersion('1.0')
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, swaggerConf);
	SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
	const app = await setupApp();
	const configService = app.get(ConfigService);
	setupSwagger(app);
	await app.listen(configService.get('PORT'));
}
bootstrap();
