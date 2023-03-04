import { Controller, Get, UseGuards } from '@nestjs/common';
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
	constructor(private readonly authService: AuthService) {}

	@MessagePattern('hash-password')
	hashPasswordEvent(
		@Payload() plainPassword: { password: string },
		@Ctx() context: RmqContext
	) {
		const channel = context.getChannelRef();
		const msg = context.getMessage();
		channel.ack(msg);
		return this.authService.hashPassword(plainPassword);
	}

	@MessagePattern('login')
	loginEvent(@Payload() payload: { user: any }, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const msg = context.getMessage();
		channel.ack(msg);
		return this.authService.login(payload.user);
	}

	@UseGuards(JwtGuard)
	@MessagePattern('validate')
	validateEvent(@CurrentUser() user: User, @Ctx() context: RmqContext) {
		const channel = context.getChannelRef();
		const msg = context.getMessage();
		channel.ack(msg);
		return user;
	}

	@MessagePattern('face-login')
	faceLoginEvent(
		@Payload() payload: { file: any; model: string },
		@Ctx() context: RmqContext
	) {
		const channel = context.getChannelRef();
		const msg = context.getMessage();
		channel.ack(msg);
		return this.authService.faceLogin(payload.file, payload.model);
	}
}
