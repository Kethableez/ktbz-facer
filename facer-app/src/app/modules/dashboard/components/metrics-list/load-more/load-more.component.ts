import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'ktbz-load-more',
	templateUrl: './load-more.component.html',
	styleUrls: ['./load-more.component.scss'],
})
export class LoadMoreComponent {
	@Input()
	max: number = 0;

	@Input()
	current: number = 0;

	@Output()
	onLoadMode = new EventEmitter<void>();

	constructor() {}

	loadMore() {
		this.onLoadMode.emit();
	}

	get isButtonVisible() {
		return this.current < this.max;
	}

	get progressBarWidth() {
		return Math.floor((this.current / this.max) * 100);
	}
}
