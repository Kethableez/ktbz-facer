import { AbstractDocument } from '@ktbz/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema()
export class Client extends AbstractDocument {
	@Prop({ required: true })
	clientId: string;

	@Prop({ required: true })
	bindUsers: string[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
