import { JwtAuthGuard } from '@ktbz/common/auth/jwt-auth.guard';
import { Controller, Get, Inject, Param, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { GatewayService } from './gateway.service';

@Controller()
export class GatewayController {
	constructor(
		private readonly gatewayService: GatewayService,
		@Inject('USER') private gatewayClient: ClientProxy
	) {}
}
