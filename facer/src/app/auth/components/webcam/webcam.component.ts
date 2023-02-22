import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
	selector: 'ktbz-webcam',
	templateUrl: './webcam.component.html',
	styleUrls: ['./webcam.component.scss'],
})
export class WebcamComponent {
	@Output()
	onImageSave = new EventEmitter<WebcamImage>();

	private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

	private trigger: Subject<void> = new Subject<void>();

	image: WebcamImage | null = null;

	get nextWebcam$() {
		return this.nextWebcam.asObservable();
	}

	get trigger$() {
		return this.trigger.asObservable();
	}

	constructor() {}

	switchCamera() {
		this.nextWebcam.next(true);
	}

	capture() {
		this.trigger.next();
	}

	handleImage(image: WebcamImage) {
		this.image = image;
	}

	takeNew() {
		this.image = null;
	}

	saveImage() {
		if (this.image) {
			this.onImageSave.emit(this.image);
		}
	}
}
