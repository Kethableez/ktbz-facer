import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { UserData } from '../models/user-data.model';
import { Metrics } from '../models/metrics.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
	private readonly apiUrl = environment.apiUrl;

	constructor(private http: HttpClient) {}

	getUserData(): Observable<UserData> {
		const url = `${this.apiUrl}/user/current`;
		return this.http.get<UserData>(url);
	}

	getUserClients(userId: string) {
		const url = `${this.apiUrl}/client/get-user-clients/${userId}`;
		return this.http.get(url);
	}

	unbindFromClient(userId: string) {
		const url = `${this.apiUrl}/client/unbind`;
		return this.http.post(url, { userId: userId });
	}

	getMetrics(): Observable<Metrics[]> {
		const url = `${this.apiUrl}/metrics/all`;
		return this.http.get<Metrics[]>(url).pipe(
			map(metricsList => {
				const sorted = metricsList.sort((m1, m2) => (m1.createdAt < m2.createdAt ? 1 : -1));
				return sorted;
			})
		);
	}
}
