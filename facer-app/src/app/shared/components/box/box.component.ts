import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'ktbz-box',
	templateUrl: './box.component.html',
	styleUrls: ['./box.component.scss'],
})
export class BoxComponent {
	@Input()
	background: string = 'bg-black';

	@Input()
	outlined = false;

	@Input()
	elevation: 'light' | 'medium' | 'strong' = 'light';

	constructor() {}

	get boxClass() {
		return this.outlined ? 'box-outlined' : 'box';
	}

	get elevationClass() {
		return `elevation-${this.elevation}`;
	}
}
