import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import * as Joi from 'joi';
import { RmqModule } from '@ktbz/common';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { APP_FILTER } from '@nestjs/core';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema: Joi.object({
				JWT_SECRET: Joi.string().required(),
				JWT_EXP_TIME: Joi.number().required(),
				RT_EXP_TIME: Joi.string().required(),
				RABBIT_MQ_URI: Joi.string().required(),
				RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
				HASH_SALT: Joi.number().required(),
			}),
			envFilePath: './libs/common/.env',
		}),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: { expiresIn: `${configService.get('JWT_EXP_TIME')}s` },
			}),
		}),
		RmqModule.register({ name: 'USER' }),
		HttpModule,
	],
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	exports: [LocalStrategy],
})
export class AuthModule {}
