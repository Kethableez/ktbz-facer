import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{ path: 'start', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
	{ path: 'playground', loadChildren: () => import('./playground/playground.module').then(m => m.PlaygroundModule) },
	{ path: 'app/dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
	{ path: '**', redirectTo: 'start' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
