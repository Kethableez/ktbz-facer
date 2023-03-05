import { FileWithUserId } from '@ktbz/common/models/file-with-user-id.model';
import { BaseResponse } from '@ktbz/common/models/response/base-response.model';
import { SimpleBuffer } from '@ktbz/common/models/simple-buffer.model';
import { HttpService } from '@nestjs/axios/dist/http.service';
import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import * as FormData from 'form-data';
import { first } from 'lodash';
import { catchError, firstValueFrom, map } from 'rxjs';
import { FileRepository } from './file.repository';

@Injectable()
export class FileService {
	constructor(
		private readonly httpService: HttpService,
		private readonly fileRepository: FileRepository,
		@Inject('USER') private userClient: ClientProxy
	) {}

	async saveFile(payload: FileWithUserId): Promise<BaseResponse> {
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

	private async handleFileSave(userId: string, filename: string): Promise<BaseResponse> {
		const existedFile = first(
			await this.fileRepository.find({
				userId: userId,
			})
		);
		if (existedFile) {
			await this.fileRepository.findOneAndUpdate(
				{ _id: existedFile._id },
				{ lastModifiedAt: new Date() }
			);
			return { message: 'Updated user image' };
		}
		await this.fileRepository.create({
			filename: filename,
			userId: userId,
			createdAt: new Date(),
			lastModifiedAt: new Date(),
		});
		return { message: 'Created user image' };
	}

	private getFormData(file: Express.Multer.File, userId: string): FormData {
		const formData = new FormData();
		formData.append('file', this.parseBufferData(file.buffer as any), {
			filename: file.originalname,
		});
		formData.append('userId', userId);

		return formData;
	}

	private parseBufferData(buffer: SimpleBuffer): Buffer {
		return Buffer.from(buffer.data);
	}
}
