import { Injectable } from '@nestjs/common';
import { MetricsRepository } from './metrics.repository';

@Injectable()
export class MetricsService {
	constructor(private readonly metricsRepository: MetricsRepository) {}

	async addMetric(newMetric: {
		type: string;
		ellapsedTime: number[];
		additionalData?: string;
	}) {
		await this.metricsRepository.create({
			...newMetric,
			additionalData: newMetric.additionalData || '-',
			createdAt: new Date(),
		});
		return { message: 'Added' };
	}

	async getMetrics() {
		return await this.metricsRepository.find({});
	}
}
