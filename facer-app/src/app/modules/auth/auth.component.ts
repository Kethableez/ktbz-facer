import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
	selector: 'ktbz-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
	constructor(private authService: AuthService) {}

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
