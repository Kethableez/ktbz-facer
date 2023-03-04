import { FitRpcException } from '@ktbz/common/rmq/rpc-exception.filter';
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpAdapterHost,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcGlobalExceptionFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: FitRpcException, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;
		const ctx = host.switchToHttp();
		const error = (exception as any).error
			? (exception as any).error
			: exception;

		const httpStatus = error.statusCode
			? error.statusCode
			: HttpStatus.INTERNAL_SERVER_ERROR;

		const responseBody = {
			statusCode: httpStatus,
			timestamp: new Date().toISOString(),
			message: error.message,
		};

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}

@Catch(HttpException)
export class HttpGlobalExceptionFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: HttpException, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;
		const ctx = host.switchToHttp();
		const status = exception.getStatus();
		const response = exception.getResponse();

		const httpStatus = status ? status : HttpStatus.INTERNAL_SERVER_ERROR;
		const responseBody = {
			statusCode: httpStatus,
			timestamp: new Date().toISOString(),
			message:
				typeof response === 'string'
					? response
					: (response as any).length !== 0
					? (response as any)
					: (response as any).message,
		};

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}
