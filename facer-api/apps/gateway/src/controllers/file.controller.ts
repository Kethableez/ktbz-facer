import { CatchExceptionInterceptor } from '@ktbz/common/interceptors/catch-exception.interceptor';
import { HttpService } from '@nestjs/axios/dist';
import { Controller, Inject } from '@nestjs/common';
import {
	Body,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class FileController {
	constructor(
		@Inject('FILE') private fileClient: ClientProxy,
		private httpService: HttpService
	) {}

	@UseInterceptors(CatchExceptionInterceptor, FileInterceptor('file'))
	@Post('upload')
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Body() body: any
	) {
		return this.fileClient.send('file-recieved', {
			file: file,
			userId: body.userId,
		});
	}
}
