import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';

interface ResponseNotification {
	status: number;
	id: string;
	message: string;
	type: 'success' | 'error' | 'warning';
}

@Injectable({ providedIn: 'root' })
export class NotificationsService {
	notifications: ResponseNotification[] = [];

	trigger = new BehaviorSubject<string | null>(null);

	constructor() {}

	addNotification(id: string, message: string, status: number) {
		const type = id === 'register' && status === 404 ? 'warning' : status < 400 ? 'success' : 'error';
		this.notifications.push({ id, message, status, type });
		this.trigger.next(id);
	}

	getNotifications$(spaceId: string) {
		return this.trigger.asObservable().pipe(
			filter(id => id === spaceId),
			map(id => this.getNotifications(id as string))
		);
	}

	removeNotification(id: string, status: number) {
		this.notifications = this.notifications.filter(n => n.id !== id && n.status !== status);
		this.trigger.next(id);
	}

	getNotifications(id: string) {
		this.notifications.filter(n => n.id === id);
	}
}
