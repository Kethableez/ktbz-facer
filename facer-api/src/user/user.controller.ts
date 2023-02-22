import { Controller } from '@nestjs/common';
import { Get, UseGuards } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger/dist/decorators';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from './models/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('currentUser')
	@UseGuards(JwtGuard)
	@ApiTags('user')
	async getCurrentUserData(): Promise<null> {
		// return await this.userService.
		return null;
	}

	@Get('all')
	@UseGuards(JwtGuard)
	@ApiTags('user')
	async getAll(): Promise<User[]> {
		return await this.userService.getAllUsers();
	}
}
