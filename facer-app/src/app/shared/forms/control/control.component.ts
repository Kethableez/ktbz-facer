import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	HostListener,
	Input,
	OnChanges,
	OnInit,
	Optional,
	SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
	selector: 'ktbz-control',
	templateUrl: './control.component.html',
	styleUrls: ['./control.component.scss'],
})
export class ControlComponent {
	@Input()
	control!: FormControl;

	@Input()
	label!: string;

	@Input()
	type: string = 'text';

	@Input()
	placeholder: string = '';

	focus = false;

	passwordVisible = false;

	@HostListener('focusin')
	onFocusin() {
		this.focus = true;
	}

	@HostListener('focusout')
	onFocusout() {
		this.focus = false;
	}

	get subClass() {
		return ['text', 'textarea', 'password'].includes(this.type) ? 'vertical' : 'horizontal';
	}

	constructor(private ref: ChangeDetectorRef) {}

	get name() {
		const parent = this.control.parent;
		if (parent instanceof FormGroup) {
			const controls = parent.controls;
			const ctrl = Object.entries(controls).find(entry => entry[1] === this.control);
			return ctrl ? ctrl[0] : null;
		}
		return null;
	}

	get errors() {
		return this.control.errors;
	}

	changeVisibility(mode: string) {
		this.passwordVisible = mode === 'on';
	}

	get passwordType() {
		return this.passwordVisible ? 'text' : 'password';
	}
}
