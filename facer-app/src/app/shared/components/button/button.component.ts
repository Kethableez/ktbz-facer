import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'ktbz-button',
	templateUrl: './button.component.html',
	styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
	@Input()
	variant: string = 'normal';

	@Input()
	color: string = 'primary';

	constructor() {}
}
