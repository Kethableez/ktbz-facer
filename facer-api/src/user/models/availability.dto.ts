import { ApiProperty } from '@nestjs/swagger';

export class EmailAvailabilityRequest {
	@ApiProperty()
	email: string;
}

export class UsernameAvailabilityRequest {
	@ApiProperty()
	username: string;
}

export class AvailabilityResponse {
	@ApiProperty()
	available: boolean;
}
