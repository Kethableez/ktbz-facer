import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RootState } from 'src/app/core/store/root.state';
import { selectBindClients, selectLoggedUser } from '../../store/dashboard.selectors';

@Component({
	selector: 'ktbz-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
	constructor(private store$: Store<RootState>) {}

	userData$ = this.store$.pipe(select(selectLoggedUser));
	bindClients$ = this.store$.pipe(select(selectBindClients));

	ngOnInit(): void {}
}
