import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DashboardEffects } from './dashboard.effects';
import { dashboardReducer } from './dashboard.reducers';

@NgModule({
	imports: [CommonModule, StoreModule.forFeature('dashboard', dashboardReducer), EffectsModule.forFeature([DashboardEffects])],
	exports: [],
	providers: [],
})
export class DashboardStateModule {}
