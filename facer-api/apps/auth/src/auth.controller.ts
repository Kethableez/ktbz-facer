import { RmqService } from '@ktbz/common';
import { CatchExceptionInterceptor } from '@ktbz/common/interceptors/catch-exception.interceptor';
import { FileWithModel } from '@ktbz/common/models/file-with-model.model';
import { PlainPassword } from '@ktbz/common/models/plain-password.model';
import { Controller, Inject, UseGuards, UseInterceptors } from '@nestjs/common';
import {
	ClientProxy,
	Ctx,
	MessagePattern,
	Payload,
	RmqContext,
} from '@nestjs/microservices';
import { User } from '@user/models/user.schema';
import { AuthService, TokenResponse } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { JwtGuard } from './guards/jwt.guard';

@Controller()
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly rmqService: RmqService,
		@Inject('METRICS') private metricsClient: ClientProxy
	) {}

	@MessagePattern('hash-password')
	@UseInterceptors(CatchExceptionInterceptor)
	hashPasswordEvent(
		@Payload() plainPassword: PlainPassword,
		@Ctx() context: RmqContext
	): Promise<string> {
		this.rmqService.ack(context);
		return this.authService.hashPassword(plainPassword);
	}

	@MessagePattern('login')
	@UseInterceptors(CatchExceptionInterceptor)
	async loginEvent(
		@Payload() payload: { user: any; clientId: string },
		@Ctx() context: RmqContext
	): Promise<TokenResponse> {
		this.rmqService.ack(context);

		const start = process.hrtime();
		const response = await this.authService.login(
			payload.user,
			payload.clientId
		);
		const end = process.hrtime(start);

		this.metricsClient.emit('add-metric', {
			type: 'std-login',
			ellapsedTime: end,
		});
		return response;
	}

	@UseGuards(JwtGuard)
	@MessagePattern('validate')
	@UseInterceptors(CatchExceptionInterceptor)
	validateEvent(@CurrentUser() user: User, @Ctx() context: RmqContext): User {
		this.rmqService.ack(context);
		return user;
	}

	@MessagePattern('face-login')
	@UseInterceptors(CatchExceptionInterceptor)
	async faceLoginEvent(
		@Payload() payload: FileWithModel & { clientId: string },
		@Ctx() context: RmqContext
	): Promise<TokenResponse> {
		this.rmqService.ack(context);

		const start = process.hrtime();

		const repsonse = await this.authService.faceLogin(
			payload.file,
			payload.model,
			payload.clientId
		);

		const end = process.hrtime(start);

		this.metricsClient.emit('add-metric', {
			type: 'face-login',
			ellapsedTime: end,
			additionalData: payload.model,
		});

		return repsonse;
	}
}
