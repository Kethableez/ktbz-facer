import { Controller } from '@nestjs/common';
import { Get, Req, UseGuards } from '@nestjs/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger/dist/decorators';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from './models/user.schema';
import { UserService } from './user.service';

@Controller('user')
@ApiBearerAuth()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('currentUser')
	@UseGuards(JwtGuard)
	@ApiTags('user')
	async getCurrentUserData(@Req() request): Promise<any> {
		return this.userService.getUserById(request.user.userId);
	}

	@Get('all')
	@UseGuards(JwtGuard)
	@ApiTags('user')
	async getAll(): Promise<User[]> {
		return await this.userService.getAllUsers();
	}
}
