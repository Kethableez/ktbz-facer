import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import * as Register from '../reducers/register.reducers';
import * as Login from '../reducers/login.reducers';
import * as File from '../reducers/file.reducers';

export const selectAuthState = createFeatureSelector('auth');

export const selectRegisterState: MemoizedSelector<object, Register.State> = createSelector(
	selectAuthState,
	(state: any) => state.register
);

export const selectFileState: MemoizedSelector<object, File.State> = createSelector(selectAuthState, (state: any) => state.file);

export const selectLoginState: MemoizedSelector<object, Login.State> = createSelector(selectAuthState, (state: any) => state.login);
export const selectAuthToken = createSelector(selectLoginState, state => state.accessToken);

export const isRegisterInProgress = createSelector(selectRegisterState, selectFileState, (s1, s2) => s1.inProgress || s2.inProgress);

export const registeredUserId = createSelector(selectRegisterState, state => state.userId);

export const registerSuccessMessage = createSelector(selectRegisterState, state => state.success);

export const registerErrorMessage = createSelector(selectRegisterState, state => state.error);

export const isLoginInProgress = createSelector(selectLoginState, state => state.inProgress);

export const loginSuccessMessage = createSelector(selectLoginState, state => state.success);

export const loginErrorMessage = createSelector(selectLoginState, state => state.error);

export const isFileUploadInProgress = createSelector(selectFileState, state => state.inProgress);

export const fileUploadSuccessMessage = createSelector(selectFileState, state => state.success);

export const fileUploadErrorMessage = createSelector(selectFileState, state => state.error);

export const afterRegisterData = createSelector(
	registeredUserId,
	isRegisterInProgress,
	registerErrorMessage,
	(userId, inProgress, error) => ({ userId, inProgress, error })
);
