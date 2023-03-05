import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'ktbz-box',
	templateUrl: './box.component.html',
	styleUrls: ['./box.component.scss'],
})
export class BoxComponent {
	@Input()
	background: string = 'bg-white';

	@Input()
	outlined = false;

	constructor() {}

	get boxClass() {
		return this.outlined ? 'box-outlined' : 'box';
	}
}
