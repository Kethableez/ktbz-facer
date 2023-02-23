import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('Health')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get('/health')
	healthcheck(): { message: string } {
		return this.appService.healthcheck();
	}
}
