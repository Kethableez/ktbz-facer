import { RmqService } from '@ktbz/common';
import { Controller, Get } from '@nestjs/common';
import {
	Ctx,
	MessagePattern,
	Payload,
	RmqContext,
} from '@nestjs/microservices';
import { MetricsService } from './metrics.service';

@Controller()
export class MetricsController {
	constructor(
		private readonly metricsService: MetricsService,
		private rmqService: RmqService
	) {}

	@MessagePattern('add-metric')
	async addMetricEvent(
		@Payload()
		payload: {
			type: string;
			ellapsedTime: number[];
			additionalData?: string;
		},
		@Ctx() context: RmqContext
	) {
		this.rmqService.ack(context);
		return this.metricsService.addMetric(payload);
	}

	@MessagePattern('get-metrics')
	async getMetricsEvent(@Ctx() context: RmqContext) {
		this.rmqService.ack(context);
		return this.metricsService.getMetrics();
	}
}
