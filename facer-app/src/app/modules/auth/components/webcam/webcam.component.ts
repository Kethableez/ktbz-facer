import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';
import { FileProcess } from 'src/app/core/file-process';

enum WebcamVariants {
	REGISTER = 'register',
	LOGIN = 'login',
}
@Component({
	selector: 'ktbz-webcam',
	templateUrl: './webcam.component.html',
	styleUrls: ['./webcam.component.scss'],
})
export class WebcamComponent {
	@Input()
	variant: WebcamVariants.REGISTER | string = WebcamVariants.REGISTER;

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

	get videoSize() {
		return this.elementRef.nativeElement && this.variant !== WebcamVariants.REGISTER
			? {
					width: this.elementRef.nativeElement.offsetWidth,
					height: (this.elementRef.nativeElement.offsetWidth * 3) / 4,
			  }
			: { width: 1280, height: 920 };
	}

	constructor(private elementRef: ElementRef) {}

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

	close() {
		this.onClose.emit();
	}
}
