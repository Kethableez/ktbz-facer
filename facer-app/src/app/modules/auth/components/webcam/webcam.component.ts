import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs';

@Component({
	selector: 'ktbz-webcam',
	templateUrl: './webcam.component.html',
	styleUrls: ['./webcam.component.scss'],
})
export class WebcamComponent implements AfterViewInit {
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

	constructor(
    private elementRef: ElementRef
  ) {}

  ngAfterViewInit(): void {
    if (this.elementRef.nativeElement) {
      console.log(this.elementRef.nativeElement.width)
    }
  }

  get videoSize() {
    return this.elementRef.nativeElement && this.variant !== 'register' ? {
      width: this.elementRef.nativeElement.offsetWidth,
      height: this.elementRef.nativeElement.offsetWidth * 3 / 4
    } : { width: 1280, height: 920}
  }

	switchCamera() {
		this.nextWebcam.next(true);
    if (this.elementRef.nativeElement) {
      console.log(this.elementRef.nativeElement.offsetWidth)
    }
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
