import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	healthcheck(): { message: string } {
		return { message: 'Working super fine' };
	}
}
