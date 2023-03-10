import { Injectable } from '@nestjs/common';
import { ClientRepository } from './client.repository';
import * as uuid from 'uuid';
import { BaseResponse } from '@ktbz/common/models/response/base-response.model';
import { RpcException } from '@nestjs/microservices';
import { first } from 'lodash';

@Injectable()
export class ClientService {
	constructor(private readonly clientRepository: ClientRepository) {}

	async createClient(): Promise<{ clientId: string }> {
		const newClientId = uuid.v4();
		const newClient = await this.clientRepository.create({
			clientId: newClientId,
			bindUsers: [],
		});
		return { clientId: newClientId };
	}

	async bindUser(userId: string, clientId: string): Promise<BaseResponse> {
		const client = await this.clientRepository.findOne({ clientId: clientId });
		if (!client)
			throw new RpcException({
				message: 'Client not found',
				statusCode: 404,
			});

		const users = [...client.bindUsers, userId];
		await this.clientRepository.findOneAndUpdate(
			{ clientId: clientId },
			{ bindUsers: users }
		);
		return { message: 'Done' };
	}

	async unbindUser(userId: string, clientId: string): Promise<BaseResponse> {
		const client = await this.clientRepository.findOne({ clientId: clientId });
		if (!client)
			throw new RpcException({
				message: 'Client not found',
				statusCode: 404,
			});

		const users = client.bindUsers.filter((id) => id !== userId);
		await this.clientRepository.findOneAndUpdate(
			{ clientId: clientId },
			{ bindUsers: users }
		);
		return { message: 'Done' };
	}

	async checkUser(userId: string, clientId: string): Promise<any> {
		const clients = await this.clientRepository.find({ clientId: clientId });
		const client = first(clients);
		if (!client) {
			throw new RpcException({
				message: 'Client not found',
				statusCode: 404,
			});
		}

		const isIn = client.bindUsers.includes(userId);

		return { isIn: isIn };
	}

	async getUserClients(userId: string): Promise<any> {
		return (
			await this.clientRepository.find({ bindUsers: { $in: [userId] } })
		).map((client) => client.clientId);
	}
}
