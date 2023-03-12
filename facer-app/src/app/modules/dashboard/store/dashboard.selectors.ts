import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import * as Dashboard from './dashboard.reducers';

export const selectDashboardState: MemoizedSelector<object, Dashboard.State> = createFeatureSelector('dashboard');

export const selectLoggedUser = createSelector(selectDashboardState, state => state.userData);

export const selectLoggedUserId: MemoizedSelector<object, string> = createSelector(selectLoggedUser, state => state._id);

export const selectMetrics = createSelector(selectDashboardState, state => state.metrics);

export const selectBindClients = createSelector(selectDashboardState, state => state.clients);

export const selectDashboardDataInProgress = createSelector(
	selectDashboardState,
	state => state.clientsInProgress || state.userDataInProgress || state.metricsInProgress
);
