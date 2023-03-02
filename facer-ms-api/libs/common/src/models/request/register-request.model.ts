import { UserExists } from '@ktbz/common/validators/user-exists.validator';
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
  @UserExists('username')
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @UserExists('email')
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsBoolean()
  useFaceAsAuthMethod: boolean;
}
