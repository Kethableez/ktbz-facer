import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { FileEffects } from './effects/file.effects';
import { LoginEffects } from './effects/login.effects';
import { RegisterEffects } from './effects/register.effects';
import { fileReducer } from './reducers/file.reducers';
import { loginReducer } from './reducers/login.reducers';
import { registerReducer } from './reducers/register.reducers';

const reducers = {
	register: registerReducer,
	login: loginReducer,
	file: fileReducer,
};

@NgModule({
	imports: [CommonModule, StoreModule.forFeature('auth', reducers), EffectsModule.forFeature([RegisterEffects, LoginEffects, FileEffects])],
	declarations: [],
})
export class AuthStateModule {}
