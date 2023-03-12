import { Action, createReducer, on } from '@ngrx/store';
import {
	clearLoginResponse,
	faceLoginAction,
	loginAction,
	loginErrorAction,
	loginSuccessAction,
	logoutAction,
} from '../actions/login.actions';

export interface State {
	inProgress: boolean;
	accessToken: string | null;
	success: string | null;
	error: string | null;
}

export const initialState: State = {
	accessToken: null,
	inProgress: false,
	success: null,
	error: null,
};

export const loginReducer = createReducer(
	initialState,
	on(loginAction, state => ({
		...state,
		inProgress: true,
		error: null,
		success: null,
	})),
	on(faceLoginAction, state => ({
		...state,
		inProgress: true,
		error: null,
		success: null,
	})),
	on(loginSuccessAction, (state, payload) => ({
		...state,
		accessToken: payload.accessToken,
		inProgress: false,
		success: payload.message,
	})),
	on(loginErrorAction, (state, payload) => ({
		...state,
		inProgress: false,
		error: typeof payload.message === 'string' ? payload.message : (payload.message as string[]).join('\n'),
	})),
	on(logoutAction, state => ({
		...state,
		accessToken: null,
	})),
	on(clearLoginResponse, state => ({
		...state,
		inProgress: false,
		error: null,
		success: null,
	}))
);

export const loginFeatureKey = 'login';

export function reducer(state: State | undefined, action: Action) {
	return loginReducer(state, action);
}
