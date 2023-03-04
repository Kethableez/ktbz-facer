import { HttpService } from '@nestjs/axios/dist/http.service';
import { HttpException, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import * as FormData from 'form-data';
import { first } from 'lodash';
import { ObjectId } from 'mongoose';
import { firstValueFrom, map, catchError } from 'rxjs';
import { FileRepository } from './file.repository';

@Injectable()
export class FileService {
	constructor(
		private readonly httpService: HttpService,
		private readonly fileRepository: FileRepository,
		@Inject('USER') private userClient: ClientProxy
	) {}

	async saveFile(payload: { file: Express.Multer.File; userId: string }) {
		const formData = this.getFormData(payload.file, payload.userId);

		const requestedPayload = await firstValueFrom(
			this.userClient.send('check-if-requested', { userId: payload.userId })
		);
		if (!requestedPayload.requested)
			throw new RpcException({ message: 'Not requested', statusCode: 400 });

		await this.handleApiCall(formData, payload.userId);

		return await this.handleFileSave(payload.userId, payload.file.originalname);
	}

	private async handleApiCall(formData: FormData, userId: string) {
		return await firstValueFrom(
			this.httpService
				.post('http://localhost:5000/ai/v1/files/upload', formData)
				.pipe(
					map(async (response) => {
						this.userClient.emit('file-process-end', {
							userId: userId,
							status: 'success',
						});
						return response;
					}),
					catchError(async (err: AxiosError) => {
						const { code, message } = err.response.data as any;
						this.userClient.emit('file-process-end', {
							userId: userId,
							status: 'failed',
						});
						throw new RpcException({
							message: message,
							statusCode: code,
						});
					})
				)
		);
	}

	private async handleFileSave(userId: string, filename: string) {
		const existedFile = first(
			await this.fileRepository.find({
				userId: userId,
			})
		);
		if (existedFile) {
			const updated = await this.fileRepository.findOneAndUpdate(
				{ _id: existedFile._id },
				{ lastModifiedAt: new Date() }
			);
			return { message: 'Updated user image', file: updated };
		}
		const newFile = await this.fileRepository.create({
			filename: filename,
			userId: userId,
			createdAt: new Date(),
			lastModifiedAt: new Date(),
		});
		return { message: 'Created user image', file: newFile };
	}

	private getFormData(file: Express.Multer.File, userId: string) {
		const formData = new FormData();
		formData.append('file', this.parseBufferData(file.buffer as any), {
			filename: file.originalname,
		});
		formData.append('userId', userId);

		return formData;
	}

	private parseBufferData(buffer: { type: 'Buffer'; data: number[] }) {
		return Buffer.from(buffer.data);
	}
}
