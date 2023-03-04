import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: any) => {
					return request.Authorization;
				},
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET'),
		});
	}

	async validate(payload: any): Promise<any> {
		try {
			return { userId: payload.sub, username: payload.username };
		} catch (err) {
			throw new RpcException({ message: 'Unauthorized', statusCode: 401 });
		}
	}
}
