import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RootState } from '../core/store/root.state';
import { registerClientAction } from '../modules/auth/store/actions/meta.actions';

@Component({
	selector: 'ktbz-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'facer app';
}
