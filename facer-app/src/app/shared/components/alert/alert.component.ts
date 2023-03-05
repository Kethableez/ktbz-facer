import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'ktbz-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
	@Input()
	type = 'info'; // info warning error success

	@Input()
	dismissable = true;

	@Output()
	onDismiss = new EventEmitter<boolean>();

	constructor() {}

	get iconType() {
		return `alert__icon--${this.type}`;
	}

	dismiss() {
		this.onDismiss.emit(true);
	}
}
