import * as Joi from '@hapi/joi';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
// import { AuthModule } from './auth/auth.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				MONGO_DB: Joi.string().required(),
				JWT_SECRET: Joi.string().required(),
				JWT_EXP_TIME: Joi.number().required(),
				PORT: Joi.number().required(),
			}),
		}),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => {
				const db = configService.get('MONGO_DB');

				return {
					uri: `mongodb://localhost:27017/${db}`,
				};
			},
			inject: [ConfigService],
		}),
		AuthModule,
		UserModule,
	],
})
export class AppModule {}
