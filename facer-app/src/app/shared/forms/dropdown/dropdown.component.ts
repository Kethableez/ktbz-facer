import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'ktbz-dropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent implements OnInit {
	value: string | null = null;

	state: 'open' | 'closed' = 'closed';

	isFocused = false;

	@Input()
	control!: FormControl;

	@Input()
	label: string = '';

	@Input()
	data: string[] = [];

	@HostListener('document:click', ['$event'])
	onClick(event: any) {
		const path = event.path || event.composedPath();
		const inPath = path.find((e: any) => e === this.elRef.nativeElement);
		if (!inPath) {
			this.toggle('closed');
		}
	}

	@HostListener('focusin')
	onFocusin() {
		this.isFocused = true;
	}

	@HostListener('focusout')
	onFocusout() {
		this.isFocused = false;
	}

	constructor(private elRef: ElementRef) {}

	ngOnInit(): void {}

	toggle(state?: 'open' | 'closed') {
		if (!this.control.touched) this.control.markAsTouched();
		if (state) {
			this.isFocused = state === 'open';
			this.state = state;
			return;
		}
		this.state = this.state === 'open' ? 'closed' : 'open';
		this.isFocused = this.state === 'open';
	}

	get displayValue() {
		return this.control.value ? this.control.value : this.label !== '' ? this.label : this.data[0];
	}

	isSelected(item: string) {
		return this.control.value === item;
	}

	selectItem(item: string) {
		this.control.setValue(item);
	}

	get status() {
		if (this.control.touched) {
			return this.control.status.toLowerCase();
		}
		return '';
	}

	get errors() {
		return this.control.errors;
	}
}
