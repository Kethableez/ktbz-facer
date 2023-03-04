import { RegisterRequest } from '@ktbz/common/models/request/register-request.model';
import {
	HttpException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { first, isEmpty } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { User } from './models/user.schema';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		@Inject('AUTH') private authClient: ClientProxy
	) {}

	async createUser(request: RegisterRequest) {
		const faceAuth = request.useFaceAsAuthMethod ? 'pending' : 'disabled';
		const requestedFaceAuthChange = faceAuth === 'pending';
		const hash = await firstValueFrom(
			this.authClient.send('hash-password', {
				password: request.password,
			})
		);
		delete request.useFaceAsAuthMethod;
		const newUser = await this.userRepository.create({
			...request,
			password: hash,
			faceAuth: faceAuth,
			requestedFaceAuthChange: requestedFaceAuthChange,
		});
		return { message: 'User registered with success', userId: newUser._id };
	}

	async getUserById(userId: string): Promise<User> {
		const user = await this.userRepository.findOne({ _id: userId });
		if (!user)
			throw new RpcException({
				message: 'User with given ID not found',
				statusCode: 404,
			});
		return user;
	}

	async getUserByUsernameOrEmail(property: string): Promise<User> {
		const user = await this.userRepository.find({
			$or: [{ username: property }, { email: property }],
		});
		if (!user || user.length === 0)
			throw new RpcException({
				message: 'User with found',
				statusCode: 404,
			});
		return first(user);
	}

	async nameAvailability(
		type: 'email' | 'username',
		value: string
	): Promise<{ available: boolean }> {
		const isAvailable = isEmpty(
			await this.userRepository.find({ [type]: value })
		);
		return { available: isAvailable };
	}

	async checkIfRequested(payload: { userId: string }) {
		try {
			const user = first(
				await this.userRepository.find({ _id: payload.userId })
			);
			if (user && user.requestedFaceAuthChange) return { requested: true };
			else return { requested: false };
		} catch (err) {
			return { requested: false };
		}
	}

	async updateAuthStatus(payload: any) {
		await this.userRepository.findOneAndUpdate(
			{ _id: payload.userId },
			{
				faceAuth: payload.status,
				requestedFaceAuthChange: payload.status !== 'success',
			}
		);
	}
}
