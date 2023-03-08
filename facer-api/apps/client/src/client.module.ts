import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientController } from './client.controller';
import { ClientRepository } from './client.repository';
import { ClientService } from './client.service';
import * as Joi from 'joi';
import { DatabaseModule } from '@ktbz/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Client, ClientSchema } from './client.schema';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				RABBIT_MQ_URI: Joi.string().required(),
				RABBIT_MQ_CLIENT_QUEUE: Joi.string().required(),
			}),
			envFilePath: './libs/common/.env',
		}),
		DatabaseModule,
		MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
	],
	controllers: [ClientController],
	providers: [ClientService, ClientRepository],
})
export class ClientModule {}
