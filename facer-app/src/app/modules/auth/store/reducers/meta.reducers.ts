import { Action, createReducer, on } from '@ngrx/store';
import { registerClientAction, registerClientErrorAction, registerClientSuccessAction } from '../actions/meta.actions';

export interface State {
	inProgress: boolean;
	clientId: string | null;
	error: string | null;
}

export const initialState: State = {
	clientId: null,
	inProgress: false,
	error: null,
};

export const metaReducer = createReducer(
	initialState,
	on(registerClientAction, state => ({
		...state,
		inProgress: true,
		error: null,
		success: null,
	})),
	on(registerClientSuccessAction, (state, payload) => ({
		...state,
		inProgress: false,
		clientId: payload.clientId,
		error: null,
	})),
	on(registerClientErrorAction, (state, payload) => ({
		...state,
		inProgress: false,
		clientId: null,
		error: payload.message,
	}))
);

export const metaFeatureKey = 'meta';

export function reducer(state: State | undefined, action: Action) {
	return metaReducer(state, action);
}
