import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { catchError, firstValueFrom } from 'rxjs';

export interface TokenResponse {
	accessToken: string;
}

@Injectable()
export class AuthService {
	constructor(
		@Inject('USER') private gatewayClient: ClientProxy,
		private configService: ConfigService,
		private jwtService: JwtService
	) {}

	async hashPassword(plainPassword: { password: string }) {
		return await bcrypt.hash(
			plainPassword.password,
			this.configService.get('HASH_SALT')
		);
	}

	async refresh() {
		return { message: 'Refresh in progress...' };
	}

	async login(user: any): Promise<TokenResponse> {
		const payload = { username: user.username, sub: user._id.toString() };
		return {
			accessToken: this.jwtService.sign(payload),
		};
	}

	async validateUser(property: string, pass: string): Promise<any> {
		const user = await firstValueFrom(
			this.gatewayClient.send('get-user-by-name', { property: property })
		);
		if (user && (await this.verifyPassword(pass, user.password))) {
			return user;
		}
		throw new RpcException({
			message: 'Invalid username or password',
			statusCode: 400,
		});
	}

	async verifyPassword(
		password: string,
		hashedPassword: string
	): Promise<boolean> {
		const isMatching = await bcrypt.compare(password, hashedPassword);
		if (!isMatching)
			throw new RpcException({
				message: 'Invalid username or password',
				statusCode: 400,
			});
		return isMatching;
	}
}
