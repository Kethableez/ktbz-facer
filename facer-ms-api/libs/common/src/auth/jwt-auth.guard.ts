import {
	CanActivate,
	ExecutionContext,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(@Inject('AUTH') private authClient: ClientProxy) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const authentication = this.getAuthentication(context);
		return this.authClient
			.send('validate', {
				Authorization: authentication,
			})
			.pipe(
				tap((res) => {
					this.addUser(res, context);
				}),
				catchError(() => {
					throw new RpcException({ message: 'Unauthorized', statusCode: 401 });
				})
			);
	}

	private getAuthentication(context: ExecutionContext) {
		let authentication: string;
		if (context.getType() === 'rpc') {
			authentication = context.switchToRpc().getData().Authentication;
		} else if (context.getType() === 'http') {
			authentication = context.switchToHttp().getRequest()
				.headers.authorization;
		}
		if (!authentication) {
			throw new RpcException({
				message: 'No value for Authentication was provided',
				statusCode: 401,
			});
		}
		return authentication.split(' ')[1];
	}

	private addUser(user: any, context: ExecutionContext) {
		if (context.getType() === 'rpc') {
			context.switchToRpc().getData().user = user;
		} else if (context.getType() === 'http') {
			context.switchToHttp().getRequest().user = user;
		}
	}
}
