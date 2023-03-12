import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
	private readonly apiUrl = environment.apiUrl;

	constructor(private http: HttpClient) {}

	getUserData(): Observable<any> {
		const url = `${this.apiUrl}/user/current`;
		return this.http.get(url);
	}

	getUserClients(userId: string) {
		const url = `${this.apiUrl}/client/get-user-clients/${userId}`;
		return this.http.get(url);
	}

	unbindFromClient(userId: string) {
		const url = `${this.apiUrl}/client/unbind`;
		return this.http.post(url, { userId: userId });
	}

	getMetrics() {
		const url = `${this.apiUrl}/metrics/all`;
		return this.http.get(url);
	}
}
