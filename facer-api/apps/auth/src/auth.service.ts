import { PlainPassword } from '@ktbz/common/models/plain-password.model';
import { SimpleBuffer } from '@ktbz/common/models/simple-buffer.model';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AxiosError } from 'axios';
import * as bcrypt from 'bcrypt';
import * as FormData from 'form-data';
import { catchError, firstValueFrom, map } from 'rxjs';

export interface TokenResponse {
	accessToken: string;
}

@Injectable()
export class AuthService {
	constructor(
		private readonly httpService: HttpService,
		@Inject('USER') private userClient: ClientProxy,
		@Inject('CLIENT') private clientClient: ClientProxy,
		private configService: ConfigService,
		private jwtService: JwtService
	) {}

	private readonly apiModelUrl = [
		this.configService.get('API_AI_URI'),
		'model/static-recognise',
	].join('/');

	async hashPassword(plainPassword: PlainPassword): Promise<string> {
		return await bcrypt.hash(
			plainPassword.password,
			this.configService.get('HASH_SALT')
		);
	}

	async refresh() {
		return { message: 'Refresh in progress...' };
	}

	async login(user: any, clientId?: string): Promise<TokenResponse> {
		const payload = { username: user.username, sub: user._id.toString() };

		if (clientId) {
			this.handleUserBinding(clientId, user._id.toString());
		}

		return {
			accessToken: this.jwtService.sign(payload),
		};
	}

	private async handleUserBinding(clientId: string, userId: string) {
		const { isIn } = await firstValueFrom(
			this.clientClient.send('check-user', {
				userId: userId,
				clientId: clientId,
			})
		);
		if (!isIn) {
			this.clientClient.emit('bind-user', {
				clientId: clientId,
				userId: userId,
			});
		}
	}

	async validateUser(property: string, pass: string): Promise<any> {
		const user = await firstValueFrom(
			this.userClient.send('get-user-by-name', { property: property })
		);
		if (user && (await this.verifyPassword(pass, user.password))) {
			return user;
		}
		throw new RpcException({
			message: 'Invalid username or password',
			statusCode: 400,
		});
	}

	async verifyPassword(
		password: string,
		hashedPassword: string
	): Promise<boolean> {
		const isMatching = await bcrypt.compare(password, hashedPassword);
		if (!isMatching)
			throw new RpcException({
				message: 'Invalid username or password',
				statusCode: 400,
			});
		return isMatching;
	}

	async faceLogin(
		file: Express.Multer.File,
		model: string,
		clientId: string
	): Promise<TokenResponse> {
		const fd = this.getFormData(file, model);
		const response = await this.handleApiCall(fd);
		await this.checkPermissions(clientId, response.foundId);
		const user = await firstValueFrom(
			this.userClient.send('get-user', { userId: response.foundId })
		);
		return await this.login(user);
	}

	private async checkPermissions(clientId: string, userId: string) {
		const { isIn } = await firstValueFrom(
			this.clientClient.send('check-user', {
				userId: userId,
				clientId: clientId,
			})
		);
		if (!isIn)
			throw new RpcException({
				message: 'You are not bind to this browser',
				statusCode: 400,
			});
		else return;
	}

	private async handleApiCall(
		formData: FormData
	): Promise<{ foundId: string }> {
		return await firstValueFrom(
			this.httpService.post(this.apiModelUrl, formData).pipe(
				map((response) => response.data),
				catchError((err: AxiosError) => {
					const { code, message } = err.response.data as any;
					throw new RpcException({
						message: message,
						statusCode: code,
					});
				})
			)
		);
	}

	private getFormData(file: Express.Multer.File, model: string): FormData {
		const formData = new FormData();
		formData.append('file', this.parseBufferData(file.buffer as any), {
			filename: '.',
		});
		formData.append('model', model);
		return formData;
	}

	private parseBufferData(buffer: SimpleBuffer): Buffer {
		return Buffer.from(buffer.data);
	}

	checkIfCanDo() {
		return true;
	}
}
