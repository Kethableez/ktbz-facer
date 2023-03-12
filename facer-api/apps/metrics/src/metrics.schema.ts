import { AbstractDocument } from '@ktbz/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MetricsDocument = Metrics & Document;

@Schema()
export class Metrics extends AbstractDocument {
	@Prop({ required: true })
	type: string;

	@Prop({ required: true })
	additionalData: string;

	@Prop({ required: true })
	createdAt: Date;

	@Prop({ required: true })
	ellapsedTime: number[];
}

export const MetricsSchema = SchemaFactory.createForClass(Metrics);
