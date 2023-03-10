import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap, withLatestFrom } from 'rxjs';
import { RootState } from 'src/app/core/store/root.state';
import { AuthService } from '../../services/auth.service';
import { registerClientAction, registerClientErrorAction, registerClientSuccessAction } from '../actions/meta.actions';
import { selectClientId } from '../selectors/auth.selectors';

@Injectable()
export class MetaEffects {
	constructor(private store$: Store<RootState>, private actions$: Actions, private authService: AuthService) {}

	registerClient$ = createEffect(() =>
		this.actions$.pipe(
			ofType(registerClientAction),
			withLatestFrom(this.store$.pipe(select(selectClientId))),
			filter(([_, clientId]) => !clientId),
			switchMap(() =>
				this.authService.registerClient().pipe(
					map(response => registerClientSuccessAction({ clientId: response.clientId })),
					catchError(response => of(registerClientErrorAction({ message: response.error.message })))
				)
			)
		)
	);
}
