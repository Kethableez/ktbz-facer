import { Action, createReducer, on } from '@ngrx/store';
import {
	getBindClientsAction,
	getBindClientsErrorAction,
	getBindClientsSuccessAction,
	getMetricsAction,
	getMetricsErrorAction,
	getMetricsSuccessAction,
	getUserDataAction,
	getUserDataErrorAction,
	getUserDataSuccessAction,
} from './dashboard.actions';

export interface State {
	userData: any | null; //Todo zmienić typ
	metrics: any | null; //Todo zmienić typ
	clients: string[] | null;

	userDataInProgress: boolean;
	metricsInProgress: boolean;
	clientsInProgress: boolean;

	userDataError: string | null;
	metricsError: string | null;
	clientsError: string | null;
}

export const initialState: State = {
	userData: null,
	metrics: null,
	clients: null,

	userDataInProgress: false,
	metricsInProgress: false,
	clientsInProgress: false,

	userDataError: null,
	metricsError: null,
	clientsError: null,
};

export const dashboardReducer = createReducer(
	initialState,
	on(getUserDataAction, state => ({
		...state,
		userDataInProgress: true,
		userDataError: null,
	})),
	on(getUserDataSuccessAction, (state, payload) => ({
		...state,
		userData: payload.user,
		userDataInProgress: false,
		userDataError: null,
	})),
	on(getUserDataErrorAction, (state, payload) => ({
		...state,
		userDataInProgress: false,
		userDataError: payload.message,
	})),
	on(getMetricsAction, state => ({
		...state,
		metricsInProgress: true,
		metricsError: null,
	})),
	on(getMetricsSuccessAction, (state, payload) => ({
		...state,
		metrics: payload.metrics,
		metricsInProgress: false,
		metricsError: null,
	})),
	on(getMetricsErrorAction, (state, payload) => ({
		...state,
		userDataInProgress: false,
		userDataError: payload.message,
	})),
	on(getBindClientsAction, state => ({
		...state,
		clientDataInProgress: true,
		clientDataError: null,
	})),
	on(getBindClientsSuccessAction, (state, payload) => ({
		...state,
		clients: payload.clients,
		clientDataInProgress: false,
		clientDataError: null,
	})),
	on(getBindClientsErrorAction, (state, payload) => ({
		...state,
		clientDataInProgress: false,
		clientDataError: payload.message,
	}))
);

export function reducer(state: State | undefined, action: Action) {
	return dashboardReducer(state, action);
}
