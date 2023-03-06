import { createAction, props } from '@ngrx/store';
import { RegisterRequest } from '../../services/auth.service';

export const registerAction = createAction('[Auth] Register', props<{ payload: RegisterRequest, data?: FormData}>());
export const registerSuccessAction = createAction('[Auth] Register success', props<{ message: string}>());
export const registerErrorAction = createAction('[Auth] Register error', props<{ message: string | string[] }>());
export const clearResponse = createAction('[Auth] Clear response');
