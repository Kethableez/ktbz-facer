import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
	selector: 'ktbz-dropdown',
	templateUrl: './dropdown.component.html',
	styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent<T> {
	@Input()
	control!: FormControl;

	@Input()
	label: string = '';

	@Input()
	data: T[] = [];

	@Input()
	placeholder: string = '';

	@Input()
	valueTransform = this.simpleTransform;

	@HostListener('document:click', ['$event'])
	onClick(event: any) {
		const path = event.path || event.composedPath();
		const inPath = path.find((e: any) => e === this.elRef.nativeElement);
		this.markAsTouched();
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

	value: T | null = null;

	state: 'open' | 'closed' = 'closed';

	isFocused = false;

	get displayValue() {
		return this.control.value ? this.valueTransform(this.control.value) : this.placeholder;
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

	constructor(private elRef: ElementRef) {}

	toggle(state?: 'open' | 'closed') {
		if (state) {
			this.isFocused = state === 'open';
			this.state = state;
			return;
		}
		this.state = this.state === 'open' ? 'closed' : 'open';
		this.isFocused = this.state === 'open';
	}

	isSelected(item: T) {
		return this.control.value === item;
	}

	selectItem(item: T) {
		this.control.setValue(item);
		this.toggle('closed');
	}

	private markAsTouched() {
		if (!this.control.touched && this.state === 'open') this.control.markAsTouched();
	}

	private simpleTransform(v: T): string {
		return `${v}`;
	}
}
