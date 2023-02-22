import { ApiProperty } from '@nestjs/swagger/dist';
import {
	IsBoolean,
	IsEmail,
	IsNotEmpty,
	IsString,
	MaxLength,
	MinLength,
} from 'class-validator';

export class RegisterRequest {
	@IsNotEmpty()
	@IsString()
	@ApiProperty()
	username: string;

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	@ApiProperty()
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
