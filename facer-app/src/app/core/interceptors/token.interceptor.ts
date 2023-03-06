import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, first, switchMap } from 'rxjs';
import { selectAuthToken } from 'src/app/modules/auth/store/selectors/auth.selectors';
import { RootState } from '../store/root.state';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private store$: Store<RootState>) {}

	intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return this.store$.pipe(
			select(selectAuthToken),
			first(),
			switchMap(token => {
				req = token ? this.addToken(req, token) : req;

				return next.handle(req);
			})
		);
	}

	private addToken(req: HttpRequest<unknown>, token: string) {
		return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
	}
}
