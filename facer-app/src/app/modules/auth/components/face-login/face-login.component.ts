import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { WebcamImage } from 'ngx-webcam';
import { BehaviorSubject, Subject } from 'rxjs';
import { FileProcess } from 'src/app/core/file-process';
import { RootState } from 'src/app/core/store/root.state';
import { faceLoginAction } from '../../store/actions/login.actions';

@Component({
	selector: 'ktbz-face-login',
	templateUrl: './face-login.component.html',
	styleUrls: ['./face-login.component.scss'],
})
export class FaceLoginComponent implements OnInit {
	@Output()
	onFormChange = new EventEmitter<void>();

	trigger = new Subject<void>();

	modelControl!: FormControl;

	constructor(private builder: FormBuilder, private store$: Store<RootState>) {}

	ngOnInit(): void {
		this.initControl();
	}

	private initControl() {
		this.modelControl = this.builder.nonNullable.control(null, Validators.required);
	}

	submit(faceImage: WebcamImage) {
		const formData = FileProcess.dataURLtoFormData('.', faceImage.imageAsDataUrl);
		formData.append('model', this.modelControl.value);
		this.store$.dispatch(faceLoginAction({ data: formData }));
	}

	switchToRegisterForm() {
		this.onFormChange.emit();
	}

	initLoginAction() {
		this.trigger.next();
	}
}
