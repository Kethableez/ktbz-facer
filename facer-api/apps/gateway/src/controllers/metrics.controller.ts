import { CatchExceptionInterceptor } from '@ktbz/common/interceptors/catch-exception.interceptor';
import { Controller, Inject, Get, UseInterceptors } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('metrics')
export class MetricsController {
	constructor(@Inject('METRICS') private metricsClient: ClientProxy) {}

	@Get('all')
	@UseInterceptors(CatchExceptionInterceptor)
	uploadFile(): Observable<any> {
		return this.metricsClient.send('get-metrics', {});
	}
}
