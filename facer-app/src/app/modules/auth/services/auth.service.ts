import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';
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

export interface BaseResponse {
	message: string;
}

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private readonly apiUrl = environment.apiUrl;

	constructor(private http: HttpClient) {}

	registerClient(): Observable<{ clientId: string }> {
		const url = `${this.apiUrl}/client/register`;
		return this.http.get<{ clientId: string }>(url);
	}

	checkAvailability(value: string, type: 'email' | 'username'): Observable<NameAvailability> {
		const url = `${this.apiUrl}/user/availability/${type}`;
		const payload = {
			[type]: value,
		};
		return this.http.post<NameAvailability>(url, payload);
	}

	register(request: { payload: RegisterRequest; data?: FormData }): Observable<BaseResponse & { userId: string }> {
		const url = `${this.apiUrl}/user/register`;
		return this.http.post<{ userId: string; message: string }>(url, request.payload);
	}

	uploadFile(data: FormData): Observable<BaseResponse> {
		const url = `${this.apiUrl}/file/upload`;
		return this.http.post<{ message: string }>(url, data);
	}

	login(payload: LoginRequest): Observable<{ accessToken: string }> {
		const url = `${this.apiUrl}/auth/login`;
		return this.http.post<{ accessToken: string }>(url, payload);
	}

	faceLogin(formData: FormData): Observable<{ accessToken: string }> {
		const url = `${this.apiUrl}/auth/face-login`;
		return this.http.post<{ accessToken: string }>(url, formData);
	}
}
