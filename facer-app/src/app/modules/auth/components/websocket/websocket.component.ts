import { Component, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { FileProcess } from 'src/app/core/file-process';
import { WebsocketService } from '../../services/websocket.service';

@Component({
	selector: 'ktbz-websocket',
	templateUrl: './websocket.component.html',
	styleUrls: ['./websocket.component.scss'],
})
export class WebsocketComponent {
	filter: any;
	constructor(public chat: WebsocketService) {}

	ngOnInit(): void {
		// this.chat.getMessage().subscribe(message => {
		//   this.chat.messages.push(message)
		// })
		// this.chat.chattingWith.subscribe(user => {
		//   this.chattingWith = user
		//   this.filter = { $or: [{from: user.id},{to: user.id}]
		//   }
		// })
	}

	sendMessage(image: WebcamImage) {
		const b = FileProcess.dataUrltoBlob(image.imageAsDataUrl);
		this.chat.sendMessage(b);
	}

	messages$ = this.chat.getMessage();
}
