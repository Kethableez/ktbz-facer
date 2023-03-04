import { Controller, Get, UseInterceptors } from '@nestjs/common';
import {
	Ctx,
	MessagePattern,
	Payload,
	RmqContext,
} from '@nestjs/microservices';
import { CatchExceptionInterceptor } from '../../../libs/common/src/interceptors/catch-exception.interceptor';
import { UserService } from './user.service';

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@MessagePattern('create-user')
	@UseInterceptors(CatchExceptionInterceptor)
	createUserEvent(@Payload() data: any, @Ctx() context: RmqContext) {
		const response = this.userService.createUser(data);
		const channel = context.getChannelRef();
		const msg = context.getMessage();
		channel.ack(msg);
		return response;
	}

	@MessagePattern('get-user')
	@UseInterceptors(CatchExceptionInterceptor)
	getUserEvent(@Payload() data: any, @Ctx() context: RmqContext) {
		const response = this.userService.getUserById(data.userId);
		const channel = context.getChannelRef();
		const msg = context.getMessage();
		channel.ack(msg);
		return response;
	}

	@MessagePattern('check-availability')
	@UseInterceptors(CatchExceptionInterceptor)
	checkNameAvailabilityEvent(@Payload() data: any, @Ctx() context: RmqContext) {
		const response = this.userService.nameAvailability(
			data.selector,
			data.name
		);
		const channel = context.getChannelRef();
		const msg = context.getMessage();
		channel.ack(msg);
		return response;
	}

	@MessagePattern('get-user-by-name')
	@UseInterceptors(CatchExceptionInterceptor)
	getUserByNameEvent(@Payload() data: any, @Ctx() context: RmqContext) {
		const response = this.userService.getUserByUsernameOrEmail(data.property);
		const channel = context.getChannelRef();
		const msg = context.getMessage();
		channel.ack(msg);
		return response;
	}

	@MessagePattern('check-if-requested')
	checkIfRequestedEvent(@Payload() data: any, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const msg = context.getMessage();
		channel.ack(msg);
		const response = this.userService.checkIfRequested(data);

		return response;
	}

	@MessagePattern('file-process-end')
	fileProcessEndEvent(@Payload() data: any, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const msg = context.getMessage();
		channel.ack(msg);
		this.userService.updateAuthStatus(data);
	}
}
