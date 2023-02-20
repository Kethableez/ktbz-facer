import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'ktbz-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'facer';

	constructor(private builder: FormBuilder) {}

	form = this.builder.group({
		inp: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5)])],
		txt: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5)])],
		chk: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5)])],
	});
}
