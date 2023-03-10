import { AbstractDocument } from '@ktbz/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MetricsDocument = Metrics & Document;

@Schema()
export class Metrics extends AbstractDocument {
	@Prop({ required: true })
	type: string;

	@Prop({ required: true })
	startTimestamp: Date;

	@Prop({ required: true })
	endTimestamp: Date;
}

export const MetricsSchema = SchemaFactory.createForClass(Metrics);
