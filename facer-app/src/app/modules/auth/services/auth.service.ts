import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpErrorService } from 'src/app/core/services/http-error.service';
import { environment } from 'src/environments/environment';

export interface NameAvailability {
	available: boolean;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	useFaceAsAuthMethod: boolean;
}

export interface LoginRequest {
	username: string;
	password: string;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly apiUrl = environment.apiUrl;
	private readonly aiUrl = environment.aiUrl;

	constructor(private http: HttpClient, private errorService: HttpErrorService) {}

	checkAvailability(value: string, type: 'email' | 'username'): Observable<NameAvailability> {
		const url = `${this.apiUrl}/user/availability/${type}`;
		const payload = {
			[type]: value,
		};
		return this.http.post<NameAvailability>(url, payload);
	}

	register(request: { payload: RegisterRequest; data?: FormData }) {
		const url = `${this.apiUrl}/auth/register`;
		return this.http.post<{ userId: string; message: string }>(url, request.payload).pipe(
			switchMap(response => {
				if (request.data) {
					const fileUrl = `${this.aiUrl}/files/upload`;
					request.data.append('userId', response.userId);
					return this.http.post<{ message: string }>(fileUrl, request.data).pipe(map(() => response.message));
				}
				return of(response.message);
			}),
			catchError((error: any) => {
				this.errorService.addError('register', error.error.message);
				return of(null);
			})
		);
	}

	login(payload: LoginRequest) {
		const url = `${this.apiUrl}/auth/login`;
		return this.http
			.post<{ userId: string }>(url, payload)
			.pipe(catchError((error: any) => of(this.errorService.addError('login', error.error.message))));
	}
}
