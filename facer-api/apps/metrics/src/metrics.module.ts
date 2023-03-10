import { RmqModule, DatabaseModule } from '@ktbz/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { MetricsController } from './metrics.controller';
import { MetricsRepository } from './metrics.repository';
import { Metrics, MetricsSchema } from './metrics.schema';
import { MetricsService } from './metrics.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				RABBIT_MQ_URI: Joi.string().required(),
				RABBIT_MQ_METRICS_QUEUE: Joi.string().required(),
			}),
			envFilePath: './libs/common/.env',
		}),
		RmqModule,
		DatabaseModule,
		MongooseModule.forFeature([{ name: Metrics.name, schema: MetricsSchema }]),
	],
	controllers: [MetricsController],
	providers: [MetricsService, MetricsRepository],
})
export class MetricsModule {}
