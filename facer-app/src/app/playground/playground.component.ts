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
		drp: [null, Validators.required],
		chk: [''],
		chk2: [''],
	});
	ngOnInit(): void {}

	testData = [
		{
			value: 'val.a',
			displayValue: 'Value a',
		},
		{
			value: 'val.b',
			displayValue: 'Value b',
		},
		{
			value: 'val.c',
			displayValue: 'Value c',
		},
		{
			value: 'val.d',
			displayValue: 'Value d',
		},
		{
			value: 'val.e',
			displayValue: 'Value e',
		},
		{
			value: 'val.f',
			displayValue: 'Value f',
		},
		{
			value: 'val.g',
			displayValue: 'Value g',
		},
		{
			value: 'val.h',
			displayValue: 'Value h',
		},
	];

	transform(v: { value: string; displayValue: string }) {
		return v.displayValue;
	}
}
