import { Injectable } from '@angular/core';
import { RootState } from 'src/app/core/store/root.state';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { faceLoginAction, loginAction, loginErrorAction, loginSuccessAction } from '../actions/login.actions';
import { catchError, delay, map, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class LoginEffects {
	constructor(private store$: Store<RootState>, private actions$: Actions, private authService: AuthService, private router: Router) {}

	login$ = createEffect(() =>
		this.actions$.pipe(
			ofType(loginAction),
			switchMap(action =>
				this.authService.login(action.payload).pipe(
					map(response => loginSuccessAction({ message: 'Logged with success', accessToken: response.accessToken })),
					catchError(response => of(loginErrorAction({ message: response.error.message })))
				)
			)
		)
	);

	faceLogin$ = createEffect(() =>
		this.actions$.pipe(
			ofType(faceLoginAction),
			switchMap(action =>
				this.authService.faceLogin(action.data).pipe(
					map(response => loginSuccessAction({ message: 'Logged with success', accessToken: response.accessToken })),
					catchError(response => of(loginErrorAction({ message: response.error.message })))
				)
			)
		)
	);

	loginSuccess$ = createEffect(
		() =>
			this.actions$.pipe(
				ofType(loginSuccessAction),
				tap(() => this.router.navigate(['app', 'dashboard']))
			),
		{ dispatch: false }
	);
}
