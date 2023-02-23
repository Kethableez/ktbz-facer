import { ApiProperty } from '@nestjs/swagger/dist';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginRequest {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	username: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@MaxLength(20)
	@ApiProperty()
	password: string;
}
