import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'ktbz-playground',
	templateUrl: './playground.component.html',
	styleUrls: ['./playground.component.scss'],
})
export class PlaygroundComponent implements OnInit {
	constructor(private builder: FormBuilder) {}

	form = this.builder.group({
		inp: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5)])],
		txt: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5)])],
		chk: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(5)])],
	});
	ngOnInit(): void {}
}