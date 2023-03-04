import { AbstractRepository } from '@ktbz/common';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { File } from './file.schema';

@Injectable()
export class FileRepository extends AbstractRepository<File> {
	constructor(
		@InjectModel(File.name) fileModel: Model<File>,
		@InjectConnection() connection: Connection
	) {
		super(fileModel, connection);
	}
}
