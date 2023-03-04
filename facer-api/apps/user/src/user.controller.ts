import { RmqService } from '@ktbz/common';
import { Controller, UseInterceptors } from '@nestjs/common';
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
	constructor(
		private readonly userService: UserService,
		private readonly rmqService: RmqService
	) {}

	@MessagePattern('create-user')
	@UseInterceptors(CatchExceptionInterceptor)
	createUserEvent(@Payload() data: any, @Ctx() context: RmqContext) {
		this.rmqService.ack(context);
		const response = this.userService.createUser(data);
		return response;
	}

	@MessagePattern('get-user')
	@UseInterceptors(CatchExceptionInterceptor)
	getUserEvent(@Payload() data: any, @Ctx() context: RmqContext) {
		this.rmqService.ack(context);
		const response = this.userService.getUserById(data.userId);
		return response;
	}

	@MessagePattern('check-availability')
	@UseInterceptors(CatchExceptionInterceptor)
	checkNameAvailabilityEvent(@Payload() data: any, @Ctx() context: RmqContext) {
		this.rmqService.ack(context);
		const response = this.userService.nameAvailability(
			data.selector,
			data.name
		);
		return response;
	}

	@MessagePattern('get-user-by-name')
	@UseInterceptors(CatchExceptionInterceptor)
	getUserByNameEvent(@Payload() data: any, @Ctx() context: RmqContext) {
		this.rmqService.ack(context);
		const response = this.userService.getUserByUsernameOrEmail(data.property);
		return response;
	}

	@MessagePattern('check-if-requested')
	@UseInterceptors(CatchExceptionInterceptor)
	checkIfRequestedEvent(@Payload() data: any, @Ctx() context: RmqContext) {
		this.rmqService.ack(context);
		const response = this.userService.checkIfRequested(data);
		return response;
	}

	@MessagePattern('file-process-end')
	fileProcessEndEvent(@Payload() data: any, @Ctx() context: RmqContext) {
		this.rmqService.ack(context);
		this.userService.updateAuthStatus(data);
	}
}
