import { Injectable } from '@angular/core';
import { RootState } from 'src/app/core/store/root.state';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../services/auth.service';
import { registerAction, registerErrorAction, registerSuccessAction } from '../actions/register.actions';
import { catchError, map, switchMap, of, filter, tap, delay } from 'rxjs';
import { uploadFileAction } from '../actions/file.actions';

@Injectable()
export class RegisterEffects {
	constructor(private store$: Store<RootState>, private actions$: Actions, private authService: AuthService) {}

	register$ = createEffect(() =>
		this.actions$.pipe(
			ofType(registerAction),
			switchMap(action =>
				this.authService.register(action).pipe(
					map(response => {
						return registerSuccessAction({
							uploadFile: action.payload.useFaceAsAuthMethod && !!action.data,
							data: action.data,
							userId: response.userId,
							message: response.message,
						});
					}),
					catchError(response => of(registerErrorAction({ message: response.error.message })))
				)
			)
		)
	);

	registerSuccess$ = createEffect(() =>
		this.actions$.pipe(
			ofType(registerSuccessAction),
			filter(action => action.uploadFile && !!action.data),
			map(action => uploadFileAction({ data: action.data as FormData }))
		)
	);
}
