import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaygroundRoutingModule } from './playground-routing.module';
import { PlaygroundComponent } from './playground.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [PlaygroundComponent],
	imports: [CommonModule, SharedModule, PlaygroundRoutingModule, ReactiveFormsModule],
})
export class PlaygroundModule {}
