import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
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

function setupRabbitMQ(app: INestApplication, configService: ConfigService) {
	const user = configService.get('RABBIT_USER');
	const password = configService.get('RABBIT_PASSWORD');
	const host = configService.get('RABBIT_HOST');
	const port = configService.get('RABBIT_PORT');
	const queue = configService.get('RABBIT_QUEUE_NAME');
	app.connectMicroservice<MicroserviceOptions>({
		// transport: Transport.RMQ,
		// options: {
		// 	urls: [`amqp://${user}:${password}@${host}:${port}`],
		// 	queue: queue,
		// 	queueOptions: {
		// 		durable: true,
		// 	},
		// },
		transport: Transport.KAFKA,
		options: {
			client: {
				brokers: ['localhost:9092'],
			},
		},
	});
}

async function bootstrap() {
	// const app =
	const app = await setupApp();
	const configService = app.get(ConfigService);
	setupRabbitMQ(app, configService);

	setupSwagger(app);

	await app.startAllMicroservices();
	await app.listen(configService.get('PORT'));
}
bootstrap();
