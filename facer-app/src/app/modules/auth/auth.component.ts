import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'ktbz-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
	constructor() {}

	isFormOpened = true;
	selectedForm = 'login';

	ngOnInit(): void {}

	select(action: string) {
		this.isFormOpened = true;
		this.selectedForm = action;
	}

	closeForms() {
		this.isFormOpened = false;
	}
}
