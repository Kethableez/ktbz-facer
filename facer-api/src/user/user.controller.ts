import { Controller, OnApplicationBootstrap } from '@nestjs/common';
import { Body, Get, Post, Req, UseGuards } from '@nestjs/common/decorators';
import {
	MessagePattern,
	Payload,
	Ctx,
	RmqContext,
	ClientProxy,
	EventPattern,
	Client,
	Transport,
} from '@nestjs/microservices';
import {
	ApiBearerAuth,
	ApiBody,
	ApiTags,
} from '@nestjs/swagger/dist/decorators';
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
export class UserController {
	constructor(private readonly userService: UserService) {}

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

	@MessagePattern('file-process.process-end')
	onFilePorcessEnd(payload: { status: any; userId: string }) {
		this.userService.updateAuthStatus(payload);
	}

	@MessagePattern('file-process.is-requested')
	onRequestCheck(payload: { userId: string }) {
		return this.userService.checkIfRequested(payload);
	}
}
