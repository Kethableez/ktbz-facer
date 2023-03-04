import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ClientProxy, RpcException } from '@nestjs/microservices';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super();
	}

	async validate(username: string, password: string): Promise<any> {
		const user = await this.authService.validateUser(username, password);
		if (!user) {
			throw new RpcException({
				message: 'Invalid username or password',
				statusCode: 400,
			});
		}
		return user;
	}
}
