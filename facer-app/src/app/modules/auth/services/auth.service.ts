import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpErrorService } from 'src/app/core/services/http-error.service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
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

	userId: string = '';

	constructor(private http: HttpClient, private errorService: HttpErrorService, private notificationService: NotificationsService) {}

	checkAvailability(value: string, type: 'email' | 'username'): Observable<NameAvailability> {
		const url = `${this.apiUrl}/user/availability/${type}`;
		const payload = {
			[type]: value,
		};
		return this.http.post<NameAvailability>(url, payload);
	}

	register(request: { payload: RegisterRequest; data?: FormData }) {
		const url = `${this.apiUrl}/user/register`;
		return this.http.post<{ userId: string; message: string }>(url, request.payload);
	}

	uploadFile(data: FormData) {
		const url = `${this.apiUrl}/file/upload`;
		return this.http.post<{ message: string }>(url, data);
	}

	login(payload: LoginRequest) {
		const url = `${this.apiUrl}/auth/login`;
		return this.http.post<any>(url, payload);
	}

	faceLogin(formData: FormData) {
		const url = `${this.apiUrl}/auth/face-login`;
		return this.http.post(url, formData).pipe(catchError((error: any) => of(this.errorService.addError('login', error.error.message))));
	}

	urlEnd: { [key: string]: string } = {
		nameAvailability: 'availability/username',
		emailAvailability: 'availability/email',
		uploadFile: 'upload',
		register: 'register',
		login: 'login',
		faceLogin: 'face-login',
	};

	getModuleUrl(module: string, end: string) {
		return `${this.apiUrl}/${module}/${this.urlEnd[end]}`;
	}
}
