import { RegisterRequest } from '@ktbz/common/models/request/register-request.model';
import {
	Body,
	Controller,
	Get,
	Headers,
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
import { UserId } from '@ktbz/common/models/user-id.model';
import { Name } from '@ktbz/common/models/name.model';
import { Availability } from '@ktbz/common/models/availability.model';
import DeviceDetector from 'node-device-detector';

@Controller('user')
export class UserController {
	constructor(@Inject('USER') private userClient: ClientProxy) {}

	@Post('register')
	@UseInterceptors(CatchExceptionInterceptor)
	registerUser(
		@Body() request: RegisterRequest
	): Observable<BaseResponse & UserId> {
		return this.userClient.send('create-user', request);
	}

	@Get('current')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(CatchExceptionInterceptor)
	getCurrentUserData(@Req() request: any): Observable<User> {
		return this.userClient.send('get-user', { userId: request.user.userId });
	}

	@Post('availability/:selector')
	@UseInterceptors(CatchExceptionInterceptor)
	checkAvailability(
		@Param('selector') selector: string,
		@Body() body: { [key: string]: string }
	): Observable<Availability> {
		return this.userClient.send('check-availability', {
			selector: selector,
			value: body[selector],
		});
	}

	@Get('headers')
	getHeaders(@Req() r: any, @Headers() headers: any) {
		console.log(r);
		console.log(headers['user-agent']);
		return headers;
	}
}
