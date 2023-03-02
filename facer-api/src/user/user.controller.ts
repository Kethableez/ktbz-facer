import { Controller, OnModuleInit } from '@nestjs/common';
import {
	Body,
	Get,
	Inject,
	Param,
	Post,
	Req,
	Sse,
	UseGuards,
} from '@nestjs/common/decorators';
import { ClientKafka, MessagePattern } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import {
	ApiBearerAuth,
	ApiBody,
	ApiTags,
} from '@nestjs/swagger/dist/decorators';
import { BehaviorSubject, filter, interval, map, Observable, tap } from 'rxjs';
import { ApiGuard } from 'src/auth/guards/api.guard';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import {
	AvailabilityResponse,
	EmailAvailabilityRequest,
	UsernameAvailabilityRequest,
} from './models/availability.dto';
import { User } from './models/user.schema';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
export class UserController implements OnModuleInit {
	trigger = new BehaviorSubject<any>(null);

	constructor(
		private readonly userService: UserService,
		@Inject('USER_SERVICE') private readonly client: ClientKafka
	) {}

	async onModuleInit() {
		this.client.subscribeToResponseOf('test.456');
		await this.client.connect();
	}

	@Get('currentUser')
	@UseGuards(JwtGuard)
	async getCurrentUserData(@Req() request): Promise<any> {
		return this.userService.getUserById(request.user.userId);
	}

	@Get('all')
	@UseGuards(JwtGuard)
	async getAll(): Promise<User[]> {
		return await this.userService.getAllUsers();
	}

	@Post('/availability/email')
	@ApiBody({ type: EmailAvailabilityRequest })
	async checkEmailAvailability(
		@Body() req: { email: string }
	): Promise<AvailabilityResponse> {
		return this.userService.nameAvailability('email', req.email);
	}

	@Post('/availability/username')
	@ApiBody({ type: UsernameAvailabilityRequest })
	async checkUsernameAvailability(
		@Body() req: { username: string }
	): Promise<AvailabilityResponse> {
		return this.userService.nameAvailability('username', req.username);
	}

	@MessagePattern('file-process.end')
	onFilePorcessEnd(payload: { status: any; userId: string }) {
		this.userService.updateAuthStatus(payload);
	}

	@Get('/check-if-requested/:userId')
	@UseGuards(ApiGuard)
	async onRequestCheck(@Param() param: { userId: string }) {
		const resp = await this.userService.checkIfRequested(param.userId);
		return resp;
	}

	@Get('send-event/:id')
	sendEvent(@Param('id') clientId: string) {
		this.client.emit('sse-event', {
			clientId: clientId,
			requested: true,
			status: 'pending',
		});
		return { send: true };
	}

	@MessagePattern('sse-event')
	onEvent(payload: { status: any; userId: string }) {
		console.log('next', payload);
		this.trigger.next(payload);
	}

	@Sse('sse/:id')
	sse(@Param('id') clientId: string): Observable<any> {
		console.log(clientId);
		return this.trigger.asObservable().pipe(
			tap(() => 'sent'),
			filter((data) => data && data.clientId === clientId),
			map((data) => ({ data: data, type: 'auth' }))
		);
	}
}
