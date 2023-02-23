import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map } from 'rxjs';

interface HttpError {
	id: string;
	message: string;
}

@Injectable({ providedIn: 'root' })
export class HttpErrorService {
	errors: HttpError[] = [];

	errorTrigger = new BehaviorSubject<string | null>(null);

	constructor() {}

	getNamespaceError(namespace: string) {
		return this.errorTrigger.asObservable().pipe(
			filter(id => id === namespace),
			map(id => this.getError(id as string))
		);
	}

	addError(errorId: string, errorMessage: string) {
		const error = { id: errorId, message: errorMessage };
		this.errors = [...this.errors, error];
		this.errorTrigger.next(errorId);
	}

	getError(errorId: string) {
		return this.errors.find(error => error.id === errorId) as HttpError;
	}

	removeError(errorId: string) {
		this.errors = this.errors.filter(error => error.id !== errorId);
		this.errorTrigger.next(errorId);
	}
}
