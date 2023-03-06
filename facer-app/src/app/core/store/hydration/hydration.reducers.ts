import { Action, ActionReducer } from '@ngrx/store';
import { RootState } from '../root.state';
import { hydrateSuccess } from './hydration.actions';

function isHydrateSuccess(action: Action): action is ReturnType<typeof hydrateSuccess> {
  return action.type === hydrateSuccess.type;
}

export const hydrationMetaReducer = (reducer: ActionReducer<RootState>): ActionReducer<RootState> => {
  return (state, action) => {
    if (isHydrateSuccess(action)) {
      return action.state;
    } else {
      return reducer(state, action);
    }
  };
};
