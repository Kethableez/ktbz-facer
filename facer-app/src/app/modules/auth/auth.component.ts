import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
	selector: 'ktbz-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
	constructor() {}

	isFormOpened = true;
	selectedForm = 'login';

	select(action: string) {
		this.isFormOpened = true;
		this.selectedForm = action;
	}

	closeForms() {
		this.isFormOpened = false;
	}
}
