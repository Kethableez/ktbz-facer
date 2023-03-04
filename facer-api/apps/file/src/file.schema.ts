import { AbstractDocument } from '@ktbz/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type FileDocument = File & Document;

@Schema()
export class File extends AbstractDocument {
	@Prop({ required: true })
	filename: string;

	@Prop({ required: true })
	userId: string;

	@Prop({ required: true })
	createdAt: Date;

	@Prop({ required: true })
	lastModifiedAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
