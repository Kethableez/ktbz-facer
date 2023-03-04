import { CatchExceptionInterceptor } from '@ktbz/common/interceptors/catch-exception.interceptor';
import {
	Body,
	Controller,
	Inject,
	Post,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocalAuthGuard } from 'apps/auth/src/guards/local.guard';

@Controller('auth')
export class AuthController {
	constructor(@Inject('AUTH') private authClient: ClientProxy) {}

	@Post('login')
	@UseGuards(LocalAuthGuard)
	@UseInterceptors(CatchExceptionInterceptor)
	async login(@Req() request) {
		return this.authClient.send('login', { user: request.user });
	}

	@Post('face-login')
	@UseInterceptors(CatchExceptionInterceptor, FileInterceptor('file'))
	async faceLogin(
		@UploadedFile() file: Express.Multer.File,
		@Body() body: { model: string }
	) {
		return this.authClient.send('face-login', {
			file: file,
			model: body.model,
		});
	}
}
