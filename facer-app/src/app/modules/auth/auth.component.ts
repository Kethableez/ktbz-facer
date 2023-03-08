import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
	selector: 'ktbz-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
	constructor(private s: AuthService) {}
	activeForm = 'login';

	selectForm(action: string) {
		this.activeForm = action;
	}

	checkAgent() {
		this.s.headers().subscribe(value => console.log(value));
	}
}
