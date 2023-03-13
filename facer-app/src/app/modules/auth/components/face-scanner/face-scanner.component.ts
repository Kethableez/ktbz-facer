import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { merge, Subject } from 'rxjs';

@Component({
	selector: 'ktbz-face-scanner',
	templateUrl: './face-scanner.component.html',
	styleUrls: ['./face-scanner.component.scss'],
})
export class FaceScannerComponent implements OnInit {
	@Input()
	type: 'big' | 'small' = 'big';

	@Input()
	hasExternalTrigger = false;

	@Input()
	externalTrigger = new Subject<void>();

	@Output()
	onWebcamClose = new EventEmitter<void>();

	@Output()
	onPhotoSubmit = new EventEmitter<WebcamImage>();

	private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

	private trigger: Subject<void> = new Subject<void>();

	faceImage: WebcamImage | null = null;

	get nextWebcam$() {
		return this.nextWebcam.asObservable();
	}

	get trigger$() {
		return merge(this.trigger.asObservable(), this.externalTrigger.asObservable());
	}

	get previewUrl() {
		return this.faceImage?.imageAsDataUrl;
	}

	constructor(private ref: ElementRef) {}

	get videoOptions(): MediaTrackConstraints {
		const { width, height } = this.videoDims;

		const result: MediaTrackConstraints = {
			facingMode: 'user',
			width: { ideal: width },
			height: { ideal: height },
		};
		return result;
	}

	get videoDims() {
		const { offsetWidth, offsetHeight } = this.ref.nativeElement;

		return { width: offsetWidth, height: offsetHeight };
	}

	capturePhoto() {
		this.trigger.next();
	}

	clearPhoto() {
		this.faceImage = null;
	}

	switchCamera() {
		this.nextWebcam.next(true);
	}

	handleImage(image: WebcamImage) {
		this.faceImage = image;
		if (this.hasExternalTrigger) {
			this.onPhotoSubmit.emit(this.faceImage);
		}
	}

	submitPhoto() {
		if (this.faceImage) {
			this.onPhotoSubmit.emit(this.faceImage);
		}
	}

	closeWebcam() {
		this.onWebcamClose.emit();
	}

	ngOnInit(): void {}
}
