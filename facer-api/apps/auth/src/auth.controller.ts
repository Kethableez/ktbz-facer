import { RmqService } from '@ktbz/common';
import { CatchExceptionInterceptor } from '@ktbz/common/interceptors/catch-exception.interceptor';
import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import {
	Ctx,
	MessagePattern,
	Payload,
	RmqContext,
} from '@nestjs/microservices';
import { User } from '@user/models/user.schema';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { JwtGuard } from './guards/jwt.guard';

@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly rmqService: RmqService
	) {}

	@MessagePattern('hash-password')
	@UseInterceptors(CatchExceptionInterceptor)
	hashPasswordEvent(
		@Payload() plainPassword: { password: string },
		@Ctx() context: RmqContext
	) {
		this.rmqService.ack(context);
		return this.authService.hashPassword(plainPassword);
	}

	@MessagePattern('login')
	@UseInterceptors(CatchExceptionInterceptor)
	loginEvent(@Payload() payload: { user: any }, @Ctx() context: RmqContext) {
		this.rmqService.ack(context);
		return this.authService.login(payload.user);
	}

	@UseGuards(JwtGuard)
	@MessagePattern('validate')
	@UseInterceptors(CatchExceptionInterceptor)
	validateEvent(@CurrentUser() user: User, @Ctx() context: RmqContext) {
		this.rmqService.ack(context);
		return user;
	}

	@MessagePattern('face-login')
	@UseInterceptors(CatchExceptionInterceptor)
	faceLoginEvent(
		@Payload() payload: { file: any; model: string },
		@Ctx() context: RmqContext
	) {
		this.rmqService.ack(context);
		return this.authService.faceLogin(payload.file, payload.model);
	}
}
