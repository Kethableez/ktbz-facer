import { RmqService } from '@ktbz/common';
import { Availability } from '@ktbz/common/models/availability.model';
import { RegisterRequest } from '@ktbz/common/models/request/register-request.model';
import { BaseResponse } from '@ktbz/common/models/response/base-response.model';
import { UserId } from '@ktbz/common/models/user-id.model';
import { Controller, UseInterceptors } from '@nestjs/common';
import {
	Ctx,
	MessagePattern,
	Payload,
	RmqContext,
} from '@nestjs/microservices';
import { CatchExceptionInterceptor } from '../../../libs/common/src/interceptors/catch-exception.interceptor';
import { User } from './models/user.schema';
import { UserService } from './user.service';

@Controller()
export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly rmqService: RmqService
	) {}

	@MessagePattern('create-user')
	@UseInterceptors(CatchExceptionInterceptor)
	createUserEvent(
		@Payload() data: { request: RegisterRequest; clientId: string },
		@Ctx() context: RmqContext
	): Promise<BaseResponse & any> {
		this.rmqService.ack(context);
		const response = this.userService.createUser(data);
		return response;
	}

	@MessagePattern('get-user')
	@UseInterceptors(CatchExceptionInterceptor)
	getUserEvent(
		@Payload() data: UserId,
		@Ctx() context: RmqContext
	): Promise<User> {
		this.rmqService.ack(context);
		const response = this.userService.getUserById(data.userId);
		return response;
	}

	@MessagePattern('check-availability')
	@UseInterceptors(CatchExceptionInterceptor)
	checkNameAvailabilityEvent(
		@Payload() data: { selector: 'username' | 'email'; value: string },
		@Ctx() context: RmqContext
	): Promise<Availability> {
		this.rmqService.ack(context);
		const response = this.userService.nameAvailability(
			data.selector,
			data.value
		);
		return response;
	}

	@MessagePattern('get-user-by-name')
	@UseInterceptors(CatchExceptionInterceptor)
	getUserByNameEvent(
		@Payload() data: { property: string },
		@Ctx() context: RmqContext
	): Promise<User> {
		this.rmqService.ack(context);
		const response = this.userService.getUserByUsernameOrEmail(data.property);
		return response;
	}

	@MessagePattern('check-if-requested')
	@UseInterceptors(CatchExceptionInterceptor)
	checkIfRequestedEvent(
		@Payload() data: UserId,
		@Ctx() context: RmqContext
	): Promise<{ requested: boolean }> {
		this.rmqService.ack(context);
		const response = this.userService.checkIfRequested(data);
		return response;
	}

	@MessagePattern('file-process-end')
	fileProcessEndEvent(
		@Payload() data: { userId: string; status: string },
		@Ctx() context: RmqContext
	): void {
		this.rmqService.ack(context);
		this.userService.updateAuthStatus(data);
	}
}
