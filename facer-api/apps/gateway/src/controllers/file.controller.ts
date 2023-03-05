import { CatchExceptionInterceptor } from '@ktbz/common/interceptors/catch-exception.interceptor';
import { BaseResponse } from '@ktbz/common/models/response/base-response.model';
import { Controller, Inject } from '@nestjs/common';
import {
	Body,
	Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common/decorators';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';

@Controller('file')
export class FileController {
	constructor(@Inject('FILE') private fileClient: ClientProxy) {}

	@Post('upload')
	@UseInterceptors(CatchExceptionInterceptor, FileInterceptor('file'))
	uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Body() body: { userId: string }
	): Observable<BaseResponse> {
		return this.fileClient.send('file-recieved', {
			file: file,
			userId: body.userId,
		});
	}
}
