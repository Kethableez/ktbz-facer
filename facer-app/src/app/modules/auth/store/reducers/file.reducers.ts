import { Action, createReducer, on } from '@ngrx/store';
import { clearFileResponse, uploadFileAction, uploadFileErrorAction, uploadFileSuccessAction } from '../actions/file.actions';

export interface State {
	inProgress: boolean;
	success: string | null;
	error: string | null;
}

export const initialState: State = {
	inProgress: false,
	success: null,
	error: null,
};

export const fileReducer = createReducer(
	initialState,
	on(uploadFileAction, state => ({
		...state,
		inProgress: true,
		error: null,
		success: null,
	})),
	on(uploadFileSuccessAction, (state, payload) => ({
		...state,
		inProgress: false,
		success: payload.message,
	})),
	on(uploadFileErrorAction, (state, payload) => ({
		...state,
		inProgress: false,
		error: payload.message,
	})),
	on(clearFileResponse, state => ({
		...state,
		error: null,
		success: null,
	}))
);

export const fileFeatureKey = 'file';

export function reducer(state: State | undefined, action: Action) {
	return fileReducer(state, action);
}
