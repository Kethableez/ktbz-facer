import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'ktbz-checkbox',
	templateUrl: './checkbox.component.html',
	styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements OnInit {
	@Input()
	type: 'box' | 'switch' = 'box';

	@Input()
	control!: FormControl;

	@Input()
	label!: string;

	constructor() {}

	get name() {
		const parent = this.control.parent;
		if (parent instanceof FormGroup) {
			const controls = parent.controls;
			const ctrl = Object.entries(controls).find(entry => entry[1] === this.control);
			return ctrl ? ctrl[0] : null;
		}
		return null;
	}

	ngOnInit(): void {}
}
