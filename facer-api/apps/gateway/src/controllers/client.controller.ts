import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';

@Controller('client')
export class UserController {
	constructor(@Inject('CLIENT') private clientClient: ClientProxy) {}

	@Get('register')
	async registerClient() {
		return this.clientClient
			.send('register', {})
			.pipe(map((id: string) => ({ cid: id })));
	}
}
