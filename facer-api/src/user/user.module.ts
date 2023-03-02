import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiGuard } from 'src/auth/guards/api.guard';
import { User, UserSchema } from './models/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		ClientsModule.register([
			{
				name: 'USER_SERVICE',
				transport: Transport.KAFKA,
				options: {
					client: {
						clientId: 'api',
						brokers: ['localhost:9092'],
					},
					consumer: {
						groupId: 'api-consumer',
					},
				},
			},
		]),
	],
	controllers: [UserController],
	providers: [UserService, ApiGuard],
	exports: [UserService],
})
export class UserModule {}
