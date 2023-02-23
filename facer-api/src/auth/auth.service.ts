import {
	forwardRef,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BaseResponse } from 'src/core/models/base-response.dto';
import { RegisterRequest } from 'src/user/models/register-request.dto';
import { User } from 'src/user/models/user.schema';
import { UserService } from 'src/user/user.service';
import { TokenResponse } from './models/token-response.dto';

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async refresh(): Promise<BaseResponse> {
		return { message: 'Refresh token in progress' };
	}

	async register(
		registerData: RegisterRequest
	): Promise<{ userId: string; message: string }> {
		const user = await this.userService.createUser({
			...registerData,
			password: await bcrypt.hash(registerData.password, bcrypt.genSaltSync()),
		});
		return { userId: user._id.toString(), message: 'Registered with success!' };
	}

	async login(user: any): Promise<TokenResponse> {
		const payload = { username: user.username, sub: user._id.toString() };
		return {
			accessToken: this.jwtService.sign(payload),
		};
	}

	async validateUser(property: string, pass: string): Promise<any> {
		const user = await this.userService.getUserByUsernameOrEmail(property);
		if (user && (await this.verifyPassword(pass, user.password))) {
			return user;
		}
		throw new HttpException('Invalid username or password', 404);
	}

	async verifyPassword(
		password: string,
		hashedPassword: string
	): Promise<boolean> {
		const isMatching = await bcrypt.compare(password, hashedPassword);
		if (!isMatching)
			throw new HttpException(
				'Invalid username or password',
				HttpStatus.BAD_REQUEST
			);
		return isMatching;
	}
}
