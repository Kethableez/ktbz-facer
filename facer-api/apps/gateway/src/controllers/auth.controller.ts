import { CatchExceptionInterceptor } from '@ktbz/common/interceptors/catch-exception.interceptor';
import {
	Body,
	Controller,
	Headers,
	Inject,
	Post,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenResponse } from 'apps/auth/src/auth.service';
import { LocalAuthGuard } from 'apps/auth/src/guards/local.guard';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
	constructor(@Inject('AUTH') private authClient: ClientProxy) {}

	@Post('login')
	@UseGuards(LocalAuthGuard)
	@UseInterceptors(CatchExceptionInterceptor)
	login(
		@Req() request: any,
		@Headers() headers: any
	): Observable<TokenResponse> {
		return this.authClient.send('login', {
			user: request.user,
			clientId: headers['client-id'],
		});
	}

	@Post('face-login')
	@UseInterceptors(CatchExceptionInterceptor, FileInterceptor('file'))
	faceLogin(
		@Headers() headers: any,
		@UploadedFile() file: Express.Multer.File,
		@Body() body: { model: string }
	): Observable<TokenResponse> {
		return this.authClient.send('face-login', {
			file: file,
			model: body.model,
			clientId: headers['client-id'],
		});
	}
}
