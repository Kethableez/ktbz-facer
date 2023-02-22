import {
	forwardRef,
	HttpException,
	HttpStatus,
	Inject,
	Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
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

	async register(registerData: RegisterRequest): Promise<User> {
		const user = await this.userService.createUser({
			...registerData,
			password: await bcrypt.hash(registerData.password, bcrypt.genSaltSync()),
		});
		return user;
	}

	async login(user: any): Promise<TokenResponse> {
		const payload = { username: user.username, sub: user._id.toString() };
		return {
			accessToken: this.jwtService.sign(payload),
		};
	}

	async validateUser(property: string, pass: string): Promise<User | null> {
		const user = await this.userService.getUserByUsernameOrEmail(property);
		console.log(user);
		if (user && bcrypt.compare(pass, user.password)) {
			return user;
		}
		return null;
	}

	async verifyPassword(
		password: string,
		hashedPassword: string
	): Promise<boolean> {
		const isMatching = await bcrypt.compare(password, hashedPassword);
		if (!isMatching)
			throw new HttpException('Bad password', HttpStatus.BAD_REQUEST);
		return isMatching;
	}
}
