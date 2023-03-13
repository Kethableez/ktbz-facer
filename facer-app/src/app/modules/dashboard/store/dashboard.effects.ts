import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { RootState } from 'src/app/core/store/root.state';
import { DashboardService } from '../services/dashboard.service';
import {
	getBindClientsAction,
	getBindClientsErrorAction,
	getBindClientsSuccessAction,
	getMetricsAction,
	getMetricsErrorAction,
	getMetricsSuccessAction,
	getUserDataAction,
	getUserDataErrorAction,
	getUserDataSuccessAction,
} from './dashboard.actions';
import { selectLoggedUserId } from './dashboard.selectors';

@Injectable()
export class DashboardEffects {
	constructor(private store$: Store<RootState>, private actions$: Actions, private dashboardService: DashboardService) {}

	getUserData$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getUserDataAction),
			switchMap(() =>
				this.dashboardService.getUserData().pipe(
					map(response => getUserDataSuccessAction({ user: response })),
					catchError(response => of(getUserDataErrorAction({ message: response.error.message })))
				)
			)
		)
	);

	getMetrics$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getMetricsAction),
			switchMap(() =>
				this.dashboardService.getMetrics().pipe(
					map(response => getMetricsSuccessAction({ metrics: response })),
					catchError(response => of(getMetricsErrorAction({ message: response.error.message })))
				)
			)
		)
	);

	getBindClients$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getBindClientsAction),
			withLatestFrom(this.store$.pipe(select(selectLoggedUserId))),
			filter(([_, id]) => id !== null),
			switchMap(([_, id]) =>
				this.dashboardService.getUserClients(id as string).pipe(
					map(response => getBindClientsSuccessAction({ clients: response })),
					catchError(response => of(getBindClientsErrorAction({ message: response.error.message })))
				)
			)
		)
	);

	getUserDataSuccess$ = createEffect(() =>
		this.actions$.pipe(
			ofType(getUserDataSuccessAction),
			map(() => getBindClientsAction())
		)
	);
}
