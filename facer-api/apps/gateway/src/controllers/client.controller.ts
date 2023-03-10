import {
	Body,
	Controller,
	Get,
	Headers,
	Inject,
	Param,
	Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('client')
export class ClientController {
	constructor(@Inject('CLIENT') private clientClient: ClientProxy) {}

	@Get('register')
	async registerClient() {
		return this.clientClient.send('register-client', {});
	}

	@Post('bind')
	async bindUser(@Headers() headers: any, @Body() payload: { userId: string }) {
		const clientId = headers['client-id'];
		return this.clientClient.send('bind-user', {
			clientId: clientId,
			userId: payload.userId,
		});
	}

	@Post('unbind')
	async unbindUser(
		@Headers() headers: any,
		@Body() payload: { userId: string }
	) {
		const clientId = headers['client-id'];
		return this.clientClient.send('unbind-user', {
			clientId: clientId,
			userId: payload.userId,
		});
	}

	@Post('check-user')
	async checkUser(
		@Headers() headers: any,
		@Body() payload: { userId: string }
	) {
		const clientId = headers['client-id'];
		return this.clientClient.send('check-user', {
			clientId: clientId,
			userId: payload.userId,
		});
	}

	@Get('get-user-clients/:userId')
	async getUserClients(@Param('userId') userId: string) {
		return this.clientClient.send('get-user-clients', {
			userId: userId,
		});
	}
}
