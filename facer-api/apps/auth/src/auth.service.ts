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
		private configService: ConfigService,
		private jwtService: JwtService
	) {}

	async hashPassword(plainPassword: { password: string }) {
		return await bcrypt.hash(
			plainPassword.password,
			this.configService.get('HASH_SALT')
		);
	}

	async refresh() {
		return { message: 'Refresh in progress...' };
	}

	async login(user: any): Promise<TokenResponse> {
		const payload = { username: user.username, sub: user._id.toString() };
		return {
			accessToken: this.jwtService.sign(payload),
		};
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

	async faceLogin(file: Express.Multer.File, model: string) {
		const fd = this.getFormData(file, model);
		const response = await this.handleApiCall(fd);
		const user = await firstValueFrom(
			this.userClient.send('get-user', { userId: response.foundId })
		);
		return await this.login(user);
	}

	private async handleApiCall(
		formData: FormData
	): Promise<{ foundId: string }> {
		return await firstValueFrom(
			this.httpService
				.post('http://localhost:5000/ai/v1/model/static-recognise', formData)
				.pipe(
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

	private getFormData(file: Express.Multer.File, model: string) {
		const formData = new FormData();
		formData.append('file', this.parseBufferData(file.buffer as any), {
			filename: '.',
		});
		formData.append('model', model);
		return formData;
	}

	private parseBufferData(buffer: { type: 'Buffer'; data: number[] }) {
		return Buffer.from(buffer.data);
	}
}
