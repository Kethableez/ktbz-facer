import { CatchExceptionInterceptor } from '@ktbz/common/interceptors/catch-exception.interceptor';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import {
	Ctx,
	MessagePattern,
	Payload,
	RmqContext,
} from '@nestjs/microservices';
import { FileService } from './file.service';

@Controller()
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@MessagePattern('file-recieved')
	@UseInterceptors(CatchExceptionInterceptor)
	async fileRecievedEvent(
		@Payload() payload: { file: Express.Multer.File; userId: string },
		@Ctx() context: RmqContext
	) {
		const channel = context.getChannelRef();
		const msg = context.getMessage();
		channel.ack(msg);
		const resp = await this.fileService.saveFile(payload);
		return resp;
	}
}
