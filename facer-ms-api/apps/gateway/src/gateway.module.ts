import { DatabaseModule, RmqModule } from '@ktbz/common';
import { UserExistsRule } from '@ktbz/common/validators/user-exists.validator';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@user/models/user.schema';
import { UserModule } from '@user/user.module';
import * as Joi from 'joi';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { UserController } from './controllers/user.controller';
import { AuthController } from './controllers/auth.controller';
import { LocalStrategy } from 'apps/auth/src/strategies/local.strategy';
import { AuthModule } from 'apps/auth/src/auth.module';
import { JwtAuthGuard } from '@ktbz/common/auth/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { APP_FILTER } from '@nestjs/core';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';

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
		PassportModule,
		DatabaseModule,
		UserModule,
		AuthModule,
	],
	controllers: [GatewayController, UserController, AuthController],
	providers: [
		GatewayService,
		UserExistsRule,
		JwtAuthGuard,
		{ provide: APP_FILTER, useClass: GrpcServerExceptionFilter },
	],
})
export class GatewayModule {}
