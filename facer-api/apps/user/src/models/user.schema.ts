import { AbstractDocument } from '@ktbz/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User extends AbstractDocument {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  faceAuth: string;

  @Prop({ required: true })
  requestedFaceAuthChange: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
