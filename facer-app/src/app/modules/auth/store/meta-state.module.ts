import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MetaEffects } from './effects/meta.effects';
import { metaReducer } from './reducers/meta.reducers';

@NgModule({
	imports: [CommonModule, StoreModule.forFeature('meta', metaReducer), EffectsModule.forFeature([MetaEffects])],
	exports: [],
	providers: [],
})
export class MetaStateModule {}
