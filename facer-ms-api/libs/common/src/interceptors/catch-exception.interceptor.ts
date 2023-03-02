import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class CatchExceptionInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next.handle().pipe(
			catchError((err) => {
				return throwError(() => {
					return handleError(err);
				});
			})
		);
	}
}

function handleError(err: any) {
	if (err.response) {
		return new HttpException(err.response.message, err.response.statusCode);
	} else if (err.error) {
		return new RpcException({
			message: err.error.message,
			statusCode: err.error.statusCode,
		});
	} else {
		return new RpcException({
			message: err.message,
			statusCode: err.statusCode,
		});
	}
}
