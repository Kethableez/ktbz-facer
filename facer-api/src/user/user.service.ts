import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { first, isEmpty } from 'lodash';
import { Model } from 'mongoose';
import { RegisterRequest } from '../auth/models/register-request.dto';
import { AvailabilityResponse } from './models/availability.dto';
import { User, UserDocument } from './models/user.schema';

export interface FileProcessStatus {
	status: string;
	userId: string;
}
@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async createUser(
		request: RegisterRequest & {
			faceAuth: string;
			requestedFaceAuthChange: boolean;
		}
	): Promise<User> {
		delete request.useFaceAsAuthMethod;
		const newUser = new this.userModel({ ...request });
		return newUser.save();
	}

	async getUserById(id: string): Promise<User> {
		const user = await this.userModel.findById(id);
		if (!user) throw new NotFoundException();
		return user;
	}

	async getAllUsers(): Promise<User[]> {
		const users = await this.userModel.find();
		return users;
	}

	async getUserByUsernameOrEmail(property: string): Promise<User> {
		const user = await this.userModel.find({
			$or: [{ username: property }, { email: property }],
		});
		if (!user) throw new NotFoundException();
		return first(user);
	}

	async nameAvailability(
		type: 'email' | 'username',
		value: string
	): Promise<AvailabilityResponse> {
		const isAvailable = isEmpty(await this.userModel.find({ [type]: value }));
		return { available: isAvailable };
	}

	async updateAuthStatus(payload: FileProcessStatus) {
		await this.userModel.findByIdAndUpdate(payload.userId, {
			faceAuth: payload.status,
			requestedFaceAuthChange: payload.status !== 'success',
		});
	}

	async checkIfRequested(payload: { userId: string }) {
		try {
			const user = await this.getUserById(payload.userId);
			if (user && user.requestedFaceAuthChange) return { requested: true };
			else return { requested: false };
		} catch (err) {
			return { requested: false };
		}
	}
}
