import { Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';
import { FileProcess } from 'src/app/core/file-process';

@Component({
	selector: 'ktbz-webcam',
	templateUrl: './webcam.component.html',
	styleUrls: ['./webcam.component.scss'],
})
export class WebcamComponent {
	@Input()
	variant: 'register' | 'login' = 'register';

	@Output()
	onImageSave = new EventEmitter<WebcamImage>();

	@Output()
	onClose = new EventEmitter<void>();

	private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

	private trigger: Subject<void> = new Subject<void>();

	image: WebcamImage | null = null;

	get nextWebcam$() {
		return this.nextWebcam.asObservable();
	}

	get trigger$() {
		return this.trigger.asObservable();
	}

	constructor(private elementRef: ElementRef) {}

	get videoSize() {
		return this.elementRef.nativeElement && this.variant !== 'register'
			? {
					width: this.elementRef.nativeElement.offsetWidth,
					height: (this.elementRef.nativeElement.offsetWidth * 3) / 4,
			  }
			: { width: 1280, height: 920 };
	}

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
			console.log(this.image);
			// const b = dataURLtoFormData('test123', this.image.imageAsDataUrl);
			const b = FileProcess.dataURLtoFormData('test123', this.image.imageAsDataUrl);
			console.log(b.getAll('file'));

			this.onImageSave.emit(this.image);
		}
	}

	close() {
		this.onClose.emit();
	}
}
