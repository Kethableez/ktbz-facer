import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
	@Transform(({ value }) => value.toString())
	@ApiProperty()
	_id: ObjectId;

	@Prop({ required: true })
	@ApiProperty()
	username: string;

	@Prop({ required: true })
	@ApiProperty()
	email: string;

	@Prop({ required: true })
	@ApiProperty()
	password: string;

	@Prop({ required: true })
	@ApiProperty()
	firstName: string;

	@Prop({ required: true })
	@ApiProperty()
	lastName: string;

	@Prop({ required: true })
	@ApiProperty()
	faceAuth: string;

	@Prop({ required: true })
	requestedFaceAuthChange: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
