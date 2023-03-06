import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
	selector: 'ktbz-register-face-scanner',
	templateUrl: './register-face-scanner.component.html',
	styleUrls: ['./register-face-scanner.component.scss'],
})
export class RegisterFaceScannerComponent implements OnInit, AfterViewInit {
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
		return this.trigger.asObservable();
	}

	get previewUrl() {
		return this.faceImage?.imageAsDataUrl;
	}

	constructor(private ref: ElementRef) {}

	ngAfterViewInit(): void {
		if (this.ref.nativeElement) {
			const { offsetWidth, offsetHeight } = this.ref.nativeElement;
			console.log(offsetHeight, offsetWidth);
		}
	}

	get videoOptions(): MediaTrackConstraints {
		const { width, height } = this.videoDims;

		const result: MediaTrackConstraints = {
			width: { exact: width, min: width, ideal: width },
			height: { exact: height, min: height, ideal: height },
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
