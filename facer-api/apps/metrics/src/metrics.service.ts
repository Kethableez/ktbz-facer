import { Injectable } from '@nestjs/common';
import { MetricsRepository } from './metrics.repository';

@Injectable()
export class MetricsService {
	constructor(private readonly metricsRepository: MetricsRepository) {}

	async addMetric(newMetric: {
		type: string;
		startTimestamp: Date;
		endTimestamp: Date;
	}) {
		await this.metricsRepository.create(newMetric);
		return { message: 'Added' };
	}

	async getMetrics() {
		return await this.metricsRepository.find({});
	}
}
