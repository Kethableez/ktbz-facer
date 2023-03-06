import { Component } from '@angular/core';

@Component({
	selector: 'ktbz-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
	constructor() {}
	activeForm = 'login';

	selectForm(action: string) {
		this.activeForm = action;
	}
}
