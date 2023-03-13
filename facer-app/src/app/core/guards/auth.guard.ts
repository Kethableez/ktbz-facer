import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { selectAuthToken } from 'src/app/modules/auth/store/selectors/auth.selectors';
import { RootState } from '../store/root.state';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private store$: Store<RootState>, private router: Router) {}

	canActivate(): Observable<boolean> {
		return this.store$.select(selectAuthToken).pipe(
			map(token => {
				if (!token) this.router.navigateByUrl('start');
				return !!token;
			})
		);
	}
}
