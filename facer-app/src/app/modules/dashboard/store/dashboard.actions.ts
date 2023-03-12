import { createAction, props } from '@ngrx/store';

export const getUserDataAction = createAction('[Dashboard] Get user data');
export const getUserDataSuccessAction = createAction('[Dashboard] Get user data success', props<{ user: any }>());
export const getUserDataErrorAction = createAction('[Dashboard] Get user data error', props<{ message: string }>());

export const getMetricsAction = createAction('[Dashboard] Get metrics');
export const getMetricsSuccessAction = createAction('[Dashboard] Get metrics success', props<{ metrics: any }>());
export const getMetricsErrorAction = createAction('[Dashboard] Get metrics error', props<{ message: string }>());

export const getBindClientsAction = createAction('[Dashboard] Get bind clients');
export const getBindClientsSuccessAction = createAction('[Dashboard] Get bind clients success', props<{ clients: any }>());
export const getBindClientsErrorAction = createAction('[Dashboard] Get bind clients error', props<{ message: string }>());
