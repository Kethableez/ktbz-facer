import { Action, createReducer, on } from '@ngrx/store';
import { clearResponse, registerAction, registerErrorAction, registerSuccessAction } from '../actions/register.actions';

export interface State {
  inProgress: boolean;
  success: string | null;
  error: string | null;
}


export const initialState:State  = {
  inProgress: false,
  success: null,
  error: null
}

export const registerReducer = createReducer(
  initialState,
  on(registerAction, (state) => ({
    ...state,
    inProgress: true,
    error: null,
    success: null
  })),
  on(registerSuccessAction, (state, payload ) => ({
    ...state,
    inProgress: false,
    success: payload.message
  })),
  on(registerErrorAction, (state, payload) => ({
      ...state,
      inProgress: false,
      error: typeof payload.message === 'string' ? payload.message : (payload.message as string[]).join('\n')
  })),
  on(clearResponse, (state) => ({
    ...state,
    error: null,
    success: null
  }))
)

export const registerFeauteKey = 'register';

export function reducer(state: State | undefined, action: Action) {
  return registerReducer(state, action);
}
