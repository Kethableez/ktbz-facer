import { createAction, props } from '@ngrx/store';

export const loginAction = createAction('[Auth] Login', props<{ payload: { username: string; password: string } }>());
export const faceLoginAction = createAction('[Auth] Face login', props<{ data: FormData }>());
export const loginSuccessAction = createAction('[Auth] Login success', props<{ message: string; accessToken: string }>());
export const loginErrorAction = createAction('[Auth] Login error', props<{ message: string | string[] }>());
export const clearLoginResponse = createAction('[Auth] Clear response');
export const logoutAction = createAction('[Auth] Logout');
