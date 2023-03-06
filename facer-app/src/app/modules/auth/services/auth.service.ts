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

	uploadFile(request: FormData) {
		const fileUrl = `${this.aiUrl}/files/upload`;
		return this.http.post<{ message: string }>(fileUrl, request).pipe(
			catchError((error: any) => {
				return of(error);
			})
		);
	}

	register(request: { payload: RegisterRequest; data?: FormData }) {
		const url = `${this.apiUrl}/user/register`;
		return this.http.post<{ userId: string; message: string }>(url, request.payload).pipe(
			switchMap(response => {
				if (request.data) {
					this.userId = response.userId;
					const fileUrl = `${this.apiUrl}/file/upload`;
					request.data.append('userId', response.userId);
					return this.http.post<{ message: string }>(fileUrl, request.data).pipe(map(() => ({ message: response.message })));
				}
				return of({ message: response.message});
			})
		);
	}

	login(payload: LoginRequest) {
		const url = `${this.apiUrl}/auth/login`;
		return this.http.post<any>(url, payload)
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
    faceLogin: 'face-login'
  }

  getModuleUrl(module: string, end: string) {
    return `${this.apiUrl}/${module}/${this.urlEnd[end]}`;
  }
}
