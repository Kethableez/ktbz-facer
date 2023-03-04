import { RegisterRequest } from '@ktbz/common/models/request/register-request.model';
import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	Req,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CatchExceptionInterceptor } from '@ktbz/common/interceptors/catch-exception.interceptor';
import { Observable } from 'rxjs';
import { BaseResponse } from '@ktbz/common/models/response/base-response.model';
import { User } from '@user/models/user.schema';
import { JwtAuthGuard } from '@ktbz/common/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
	constructor(@Inject('USER') private gatewayClient: ClientProxy) {}

	@Post('register')
	@UseInterceptors(CatchExceptionInterceptor)
	registerUser(
		@Body() request: RegisterRequest
	): Observable<BaseResponse & { userId: string }> {
		return this.gatewayClient.send('create-user', request);
	}

	@Get('current')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(CatchExceptionInterceptor)
	getCurrentUserData(@Req() request): Observable<User> {
		return this.gatewayClient.send('get-user', { userId: request.user.userId });
	}

	@Post('availability/:selector')
	@UseInterceptors(CatchExceptionInterceptor)
	checkAvailability(
		@Param('selector') selector: string,
		@Body() body: { name: string }
	): Observable<{ available: boolean }> {
		return this.gatewayClient.send('check-availability', {
			selector: selector,
			name: body.name,
		});
	}
}
