import { RmqService } from '@ktbz/common';
import { CatchExceptionInterceptor } from '@ktbz/common/interceptors/catch-exception.interceptor';
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
		@Payload() payload: { file: Express.Multer.File; userId: string },
		@Ctx() context: RmqContext
	) {
		this.rmqService.ack(context);
		const resp = await this.fileService.saveFile(payload);
		return resp;
	}
}
