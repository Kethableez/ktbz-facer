import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'ktbz-spinner',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit {
	constructor() {}

	@Input()
	type: 'fluid' | 'full' = 'full';

	ngOnInit(): void {}
}
