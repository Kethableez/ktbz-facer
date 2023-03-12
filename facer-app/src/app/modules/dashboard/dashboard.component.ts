import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { RootState } from 'src/app/core/store/root.state';
import { logoutAction } from '../auth/store/actions/login.actions';
import { getBindClientsAction, getMetricsAction, getUserDataAction } from './store/dashboard.actions';
import { selectDashboardDataInProgress } from './store/dashboard.selectors';

@Component({
	selector: 'ktbz-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
	constructor(private store$: Store<RootState>) {}

	dataInProgress$ = this.store$.pipe(select(selectDashboardDataInProgress));

	ngOnInit(): void {
		this.store$.dispatch(getUserDataAction());
		this.store$.dispatch(getMetricsAction());
	}

	logout() {
		this.store$.dispatch(logoutAction());
	}
}
