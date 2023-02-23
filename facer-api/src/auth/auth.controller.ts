import {
	Controller,
	Post,
	Body,
	UseGuards,
	HttpCode,
	Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { RegisterRequest } from 'src/user/models/register-request.dto';
import { User } from 'src/user/models/user.schema';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { LoginRequest } from './models/login-request.model';
import { TokenResponse } from './models/token-response.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@ApiTags('auth')
	async register(@Body() request: RegisterRequest): Promise<User> {
		return await this.authService.register(request);
	}

	// @ApiTags('auth')
	@UseGuards(LocalAuthGuard)
	@Post('login')
	@HttpCode(200)
	@ApiBody({ type: LoginRequest })
	async login(@Req() request): Promise<TokenResponse> {
		return await this.authService.login(request.user);
		// return { accessToken: request.user };
	}
}
