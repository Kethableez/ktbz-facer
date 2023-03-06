import { createAction, props } from '@ngrx/store';

export const uploadFileAction = createAction('[Auth] Upload file', props<{ data: FormData }>());
export const uploadFileSuccessAction = createAction('[Auth] Upload file success', props<{ message: string }>());
export const uploadFileErrorAction = createAction('[Auth] Upload file error', props<{ message: string }>());
export const clearFileResponse = createAction('[Auth] Clear file');
