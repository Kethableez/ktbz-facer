import { MetaReducer } from '@ngrx/store';
import { hydrationMetaReducer } from './hydration/hydration.reducers';

export interface RootState {}

export const metaReducers: MetaReducer[] = [hydrationMetaReducer];
