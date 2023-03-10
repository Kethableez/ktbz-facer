import { AbstractRepository } from '@ktbz/common';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Metrics } from './metrics.schema';

@Injectable()
export class MetricsRepository extends AbstractRepository<Metrics> {
	constructor(
		@InjectModel(Metrics.name) metricsModel: Model<Metrics>,
		@InjectConnection() connection: Connection
	) {
		super(metricsModel, connection);
	}
}
