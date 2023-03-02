import { CatchExceptionInterceptor } from '@ktbz/common/interceptors/catch-exception.interceptor';
import { RegisterRequest } from '@ktbz/common/models/request/register-request.model';
import { BaseResponse } from '@ktbz/common/models/response/base-response.model';
import {
	Controller,
	Inject,
	Post,
	UseInterceptors,
	Body,
	Get,
	Req,
	Param,
	UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '@user/models/user.schema';
import { LocalAuthGuard } from 'apps/auth/src/guards/local.guard';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
	constructor(@Inject('AUTH') private gatewayClient: ClientProxy) {}

	@UseGuards(LocalAuthGuard)
	@UseInterceptors(CatchExceptionInterceptor)
	@Post('login')
	async login(@Req() request) {
		return this.gatewayClient.send('login', { user: request.user });
	}
}
