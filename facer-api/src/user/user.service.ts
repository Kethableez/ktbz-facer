import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterRequest } from './models/register-request.dto';
import { User, UserDocument } from './models/user.schema';

@Injectable()
export class UserService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async createUser(request: RegisterRequest): Promise<User> {
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
		})[0];
		if (!user) throw new NotFoundException();
		return user;
	}
}
