import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket } from 'ngx-socket-io';

const CHAT_URL = 'ws://localhost:5000';

export interface Message {
	source: string;
	content: string;
}

@Injectable({ providedIn: 'root' })
export class WebsocketService {
	// user: UserDetails;
	messages: any = [];
	// chattingWith = new Subject<UserDetails>();

	constructor(private socket: Socket) {}

	sendMessage(message: any) {
		this.socket.emit('test', message);
	}

	getMessage(): Observable<{ message: string }> {
		return this.socket.fromEvent('test').pipe(
			map((data: any) => {
				console.log(data);
				return data;
			})
		);
	}
}
