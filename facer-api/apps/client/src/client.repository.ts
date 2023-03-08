import { AbstractRepository } from '@ktbz/common';
import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { User } from '@user/models/user.schema';
import { Model, Connection } from 'mongoose';
import { Client } from './client.schema';

@Injectable()
export class ClientRepository extends AbstractRepository<Client> {
	constructor(
		@InjectModel(Client.name) ClientModel: Model<Client>,
		@InjectConnection() connection: Connection
	) {
		super(ClientModel, connection);
	}
}
