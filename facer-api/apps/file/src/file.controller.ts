import { RmqService } from '@ktbz/common';
import { CatchExceptionInterceptor } from '@ktbz/common/interceptors/catch-exception.interceptor';
import { FileWithUserId } from '@ktbz/common/models/file-with-user-id.model';
import { BaseResponse } from '@ktbz/common/models/response/base-response.model';
import { Controller, UseInterceptors } from '@nestjs/common';
import {
	Ctx,
	MessagePattern,
	Payload,
	RmqContext,
} from '@nestjs/microservices';
import { FileService } from './file.service';

@Controller()
export class FileController {
	constructor(
		private readonly fileService: FileService,
		private readonly rmqService: RmqService
	) {}

	@MessagePattern('file-recieved')
	@UseInterceptors(CatchExceptionInterceptor)
	async fileRecievedEvent(
		@Payload() payload: FileWithUserId,
		@Ctx() context: RmqContext
	): Promise<BaseResponse> {
		this.rmqService.ack(context);
		const resp = await this.fileService.saveFile(payload);
		return resp;
	}
}
