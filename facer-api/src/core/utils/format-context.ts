import { RmqContext } from '@nestjs/microservices';

export function formatContext<T>(ctx: RmqContext): T {
	return JSON.parse(ctx.getMessage().content.toString()) as T;
}
