import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, first, switchMap } from 'rxjs';
import { selectAuthToken, selectClientId } from 'src/app/modules/auth/store/selectors/auth.selectors';
import { RootState } from '../store/root.state';

@Injectable()
export class ClientIdInterceptor implements HttpInterceptor {
	constructor(private store$: Store<RootState>) {}

	intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return this.store$.pipe(
			select(selectClientId),
			first(),
			switchMap(clientId => {
				req = clientId ? this.addClientId(req, clientId) : req;

				return next.handle(req);
			})
		);
	}

	private addClientId(req: HttpRequest<unknown>, clientId: string) {
		return req.clone({ setHeaders: { 'client-id': clientId } });
	}
}
