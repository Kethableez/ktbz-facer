import { DatabaseModule, RmqModule, RmqService } from '@ktbz/common';
import { HttpModule } from '@nestjs/axios/dist/http.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { FileController } from './file.controller';
import { FileRepository } from './file.repository';
import { File, FileSchema } from './file.schema';
import { FileService } from './file.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				RABBIT_MQ_URI: Joi.string().required(),
				RABBIT_MQ_FILE_QUEUE: Joi.string().required(),
			}),
			envFilePath: './libs/common/.env',
		}),
		DatabaseModule,
		MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
		RmqModule.register({ name: 'USER' }),
		HttpModule,
	],
	controllers: [FileController],
	providers: [FileService, FileRepository],
})
export class FileModule {}
