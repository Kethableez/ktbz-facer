import { DatabaseModule, RmqModule } from '@ktbz/common';
import { UserExistsRule } from '@ktbz/common/validators/user-exists.validator';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@user/user.module';
import * as Joi from 'joi';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { AuthModule } from 'apps/auth/src/auth.module';
import { JwtAuthGuard } from '@ktbz/common/auth/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { APP_FILTER } from '@nestjs/core';
import { FileController } from './controllers/file.controller';
import { HttpModule } from '@nestjs/axios';
import { ClientController } from './controllers/client.controller';
import { MetricsController } from './controllers/metrics.controller';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				RABBIT_MQ_URI: Joi.string().required(),
				RABBIT_MQ_USER_QUEUE: Joi.string().required(),
				MONGO_DB_URI: Joi.string().required(),
			}),
			envFilePath: './libs/common/.env',
		}),
		RmqModule.register({
			name: 'USER',
		}),
		RmqModule.register({
			name: 'AUTH',
		}),
		RmqModule.register({
			name: 'FILE',
		}),
		RmqModule.register({
			name: 'CLIENT',
		}),
		RmqModule.register({
			name: 'METRICS',
		}),
		HttpModule,
		PassportModule,
		DatabaseModule,
		UserModule,
		AuthModule,
	],
	controllers: [
		UserController,
		AuthController,
		FileController,
		ClientController,
		MetricsController,
	],
	providers: [UserExistsRule, JwtAuthGuard],
})
export class GatewayModule {}
