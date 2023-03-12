import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { delay, tap } from 'rxjs';
import { RootState } from 'src/app/core/store/root.state';
import { getBindClientsAction } from '../../store/dashboard.actions';
import { selectBindClients, selectLoggedUser } from '../../store/dashboard.selectors';

const testUser1 = {
	username: 'facer1',
	email: 'facer1@facer.com',
	firstName: 'Adam',
	lastName: 'Savage',
	faceAuth: 'active', // 'pending' 'disabled',
	bindClients: ['15fe47c2-5414-4337-92cc-102cbec07825', '15fe47c2-5414-4337-92cc-102cbec07825', '15fe47c2-5414-4337-92cc-102cbec07825'],
};

interface UserProfile {
	username: string;
	email: string;
	firstName: string;
	lastName: string;
	faceAuth: string;
	bindClients: string[];
}

@Component({
	selector: 'ktbz-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
	constructor(private store$: Store<RootState>) {}

	userData$ = this.store$.pipe(select(selectLoggedUser));
	bindClients$ = this.store$.pipe(select(selectBindClients)).pipe(tap(v => console.log(v)));

	user: UserProfile = testUser1;

	ngOnInit(): void {
		this.store$.dispatch(getBindClientsAction());
	}
}
