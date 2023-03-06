import { Component, Input, OnInit } from '@angular/core';

export interface ErrorPair {
	name: string;
	value: null | boolean | { actuallength: number; requiredLength: number } | { field: string};
}

@Component({
	selector: 'ktbz-input-error',
	templateUrl: './input-error.component.html',
	styleUrls: ['./input-error.component.scss'],
})
export class InputErrorComponent {
	@Input()
	errors: any;

	constructor() {}

	get parsedErrors() {
		return Object.entries(this.errors).map(([name, value]) => ({
			name: name,
			value: value as null | boolean | { actuallength: number; requiredLength: number },
		}));
	}
}
