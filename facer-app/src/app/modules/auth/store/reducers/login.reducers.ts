import { Action, createReducer, on } from '@ngrx/store';
import { clearResponse, loginAction, loginErrorAction, loginSuccessAction } from '../actions/login.actions';

export interface State {
  inProgress: boolean;
  success: string | null;
  error: string | null;
}

export const initialState: State = {
  inProgress: false,
  success: null,
  error: null
}

export const loginReducer = createReducer(
  initialState,
  on(loginAction, state => ({
    ...state,
    inProgress: true,
    error: null,
    success: null
  })),
  on(loginSuccessAction, (state, payload ) => ({
    ...state,
    inProgress: false,
    success: payload.message
  })),
  on(loginErrorAction, (state, payload) => ({
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

export const loginFeatureKey = 'login';

export function reducer(state: State | undefined, action: Action) {
  return loginReducer(state, action);
}
