import { DatabaseModule, RmqModule } from '@ktbz/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';
import { User, UserSchema } from './models/user.schema';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				RABBIT_MQ_URI: Joi.string().required(),
				RABBIT_MQ_USER_QUEUE: Joi.string().required(),
			}),
			envFilePath: './libs/common/.env',
		}),
		RmqModule.register({
			name: 'AUTH',
		}),
		DatabaseModule,
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	controllers: [UserController],
	providers: [UserService, UserRepository],
	exports: [UserService],
})
export class UserModule {}
