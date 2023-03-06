import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, combineLatest, filter, map, of, switchMap, take, withLatestFrom } from 'rxjs';
import { RootState } from 'src/app/core/store/root.state';
import { AuthService } from '../../services/auth.service';
import { uploadFileAction, uploadFileErrorAction, uploadFileSuccessAction } from '../actions/file.actions';
import { afterRegisterData, isRegisterInProgress, registeredUserId, registerErrorMessage } from '../selectors/auth.selectors';

@Injectable()
export class FileEffects {
	constructor(private store$: Store<RootState>, private actions$: Actions, private authService: AuthService) {}

	uploadFile$ = createEffect(() =>
		this.actions$.pipe(
			ofType(uploadFileAction),
			withLatestFrom(this.store$.pipe(select(registeredUserId))),
			switchMap(([action, userId]) => {
				const data = action.data;
				data.append('userId', userId as string);
				return this.authService.uploadFile(action.data).pipe(
					map(response => uploadFileSuccessAction(response)),
					catchError(response => of(uploadFileErrorAction({ message: response.error.message })))
				);
			})
		)
	);
}
