import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'src/core/models/base-response.dto';
import { RegisterRequest } from 'src/user/models/register-request.dto';
import { User } from 'src/user/models/user.schema';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginRequest } from './models/login-request.dto';
import { TokenResponse } from './models/token-response.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() request: RegisterRequest): Promise<User> {
		return await this.authService.register(request);
	}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	@HttpCode(200)
	@ApiBody({ type: LoginRequest })
	async login(@Req() request): Promise<TokenResponse> {
		return await this.authService.login(request.user);
	}

	@Post('refresh')
	async refresh(): Promise<BaseResponse> {
		return await this.authService.refresh();
	}
}
