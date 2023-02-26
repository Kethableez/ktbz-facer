import { Injectable } from '@nestjs/common';
import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from 'src/user/user.service';

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
	constructor(private userService: UserService) {}

	async validate(value: string, validationArguments?: ValidationArguments) {
		try {
			return (
				(await this.userService.getUserByUsernameOrEmail(value)) === undefined
			);
		} catch (e) {
			return true;
		}
	}

	defaultMessage(validationArguments?: ValidationArguments): string {
		return `User with given ${validationArguments.constraints[0]} exists`;
	}
}

export function UserExists(
	property: string,
	validatorOptions?: ValidationOptions
) {
	return function (object: any, propertyName: string) {
		registerDecorator({
			name: 'UserExists',
			target: object.constructor,
			propertyName: propertyName,
			constraints: [property],
			options: validatorOptions,
			validator: UserExistsRule,
		});
	};
}
