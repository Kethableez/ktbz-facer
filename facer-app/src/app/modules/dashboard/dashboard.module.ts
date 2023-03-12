import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileComponent } from './components/profile/profile.component';
import { OptionsComponent } from './components/options/options.component';
import { MetricsListComponent } from './components/metrics-list/metrics-list.component';
import { MetricsListFiltersComponent } from './components/metrics-list/metrics-list-filters/metrics-list-filters.component';
import { LoadMoreComponent } from './components/metrics-list/load-more/load-more.component';
import { AuthStateModule } from '../auth/store/auth-state.module';
import { DashboardStateModule } from './store/dashboard-state.module';

@NgModule({
	declarations: [
		DashboardComponent,
		ProfileComponent,
		OptionsComponent,
		MetricsListComponent,
		MetricsListFiltersComponent,
		LoadMoreComponent,
	],
	imports: [CommonModule, SharedModule, DashboardRoutingModule, AuthStateModule, DashboardStateModule],
})
export class DashboardModule {}
