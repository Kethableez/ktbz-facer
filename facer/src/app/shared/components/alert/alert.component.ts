import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'ktbz-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
	@Input()
	type = 'info'; // info warning error pending success

	@Input()
	dismissable = true;

	@Output()
	onDismiss = new EventEmitter<boolean>();

	constructor() {}

	get icon() {
		switch (this.type) {
			case 'error':
				return 'error';
			case 'warning':
				return 'warning';
			case 'pending':
				return 'pending';
			case 'info':
				return 'info';
			default:
				return 'info';
		}
	}

	get background() {
		switch (this.type) {
			case 'error':
				return 'bg-error';
			case 'warning':
				return 'bg-warning';
			case 'success':
				return 'bg-success';
			case 'info':
				return 'bg-accent';
			default:
				return 'bg-muted';
		}
	}

	dismiss() {
		this.onDismiss.emit(true);
	}
}
