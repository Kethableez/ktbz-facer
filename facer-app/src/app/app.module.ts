import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './main/app.component';
import { SharedModule } from './shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { HydrationEffects } from './core/store/hydration/hydration.effects';
import { metaReducers } from './core/store/root.state';
import { MetaStateModule } from './modules/auth/store/meta-state.module';
import { ClientIdInterceptor } from './core/interceptors/client-id.interceptor';
import { AuthInterceptor } from './core/interceptors/token.interceptor';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		StoreModule.forRoot({}, { metaReducers }),
		EffectsModule.forRoot([HydrationEffects]),
		StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
		AppRoutingModule,
		SharedModule,
		MetaStateModule,
		ReactiveFormsModule,
		HttpClientModule,
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: ClientIdInterceptor,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
