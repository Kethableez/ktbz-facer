import { createAction, props } from '@ngrx/store';

export const registerClientAction = createAction('[Meta] Register client');
export const registerClientSuccessAction = createAction('[Meta] Register client success', props<{ clientId: string }>());
export const registerClientErrorAction = createAction('[Meta] Register client error', props<{ message: string }>());
