import { ApiProperty } from '@nestjs/swagger/dist';
import {
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';
import { UserExists } from 'src/core/validators/user-exists.validator';

export class RegisterRequest {
	@IsNotEmpty()
	@IsString()
	@UserExists('username')
	@ApiProperty()
	username: string;

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	@ApiProperty()
	@UserExists('email')
	email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(6)
	@MaxLength(20)
	@ApiProperty()
	password: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	firstName: string;

	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	lastName: string;

	@IsNotEmpty()
	@IsBoolean()
	@ApiProperty()
	useFaceAsAuthMethod: boolean;
}
