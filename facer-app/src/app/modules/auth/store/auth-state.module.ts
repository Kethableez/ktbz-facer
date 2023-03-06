
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LoginEffects } from './effects/login.effects';
import { RegisterEffects } from './effects/register.effects';
import { loginReducer } from './reducers/login.reducers';
import { registerReducer } from './reducers/register.reducers';

const reducers = {
  register: registerReducer,
  login: loginReducer
}

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature([RegisterEffects, LoginEffects])],
  declarations: []
})
export class AuthStateModule {}
