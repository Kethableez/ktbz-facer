import { RmqService } from '@ktbz/common';
import { Controller, Get } from '@nestjs/common';
import {
	Ctx,
	MessagePattern,
	Payload,
	RmqContext,
} from '@nestjs/microservices';
import { ClientService } from './client.service';

@Controller()
export class ClientController {
	constructor(
		private readonly clientService: ClientService,
		private rmqService: RmqService
	) {}

	@MessagePattern('register-client')
	registerClientEvent(@Payload() payload: any, @Ctx() context: RmqContext) {
		this.rmqService.ack(context);
		return this.clientService.createClient();
	}

	@MessagePattern('bind-user')
	bindUserEvent(@Payload() payload: any, @Ctx() context: RmqContext) {
		this.rmqService.ack(context);
		return this.clientService.bindUser(payload.userId, payload.clientId);
	}

	@MessagePattern('unbind-user')
	unbindUserEvent(@Payload() payload: any, @Ctx() context: RmqContext) {
		this.rmqService.ack(context);
		return this.clientService.unbindUser(payload.userId, payload.clientId);
	}

	@MessagePattern('check-user')
	checkUserEvent(@Payload() payload: any, @Ctx() context: RmqContext) {
		this.rmqService.ack(context);
		return this.clientService.checkUser(payload.userId, payload.clientId);
	}

	@MessagePattern('get-user-clients')
	getUserClientsEvent(@Payload() payload: any, @Ctx() context: RmqContext) {
		this.rmqService.ack(context);
		return this.clientService.getUserClients(payload.userId);
	}
}
