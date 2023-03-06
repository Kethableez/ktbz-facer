import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as Register from '../reducers/register.reducers';

export const selectAuthState = createFeatureSelector('auth');

export const selectRegisterState = createSelector(selectAuthState, (state: any) => state.register);

export const isRegisterInProgress = createSelector(selectRegisterState, state => state.inProgress);

export const registerSuccessMessage = createSelector(selectRegisterState, state => state.success);

export const registerErrorMessage = createSelector(selectRegisterState, state => state.error)

export const selectLoginState = createSelector(selectAuthState, (state: any) => state.login);

export const isLoginInProgress = createSelector(selectLoginState, state => state.inProgress);

export const loginSuccessMessage = createSelector(selectLoginState, state => state.success);

export const loginErrorMessage = createSelector(selectLoginState, state => state.error)
