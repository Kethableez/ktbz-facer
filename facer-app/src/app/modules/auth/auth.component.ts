import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/core/store/root.state';
import { AuthService } from './services/auth.service';
import { registerClientAction } from './store/actions/meta.actions';

@Component({
	selector: 'ktbz-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
	constructor(private store$: Store<RootState>) {}

	ngOnInit(): void {
		this.store$.dispatch(registerClientAction());
	}
	activeForm = 'login';

	selectForm(action: string) {
		this.activeForm = action;
	}
}
