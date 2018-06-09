import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EssayRoutingModule} from './essay-routing.module';
import {EssayCreateComponent} from './essay-create/essay-create.component';
import {EssayDetailComponent} from './essay-detail/essay-detail.component';
import {EssayListComponent} from './essay-list/essay-list.component';
import {SharedModule} from '../_shared/shared.module';
import {
  MatCardModule, MatFormFieldModule, MatIconModule, MatOptionModule, MatProgressBarModule,
  MatSelectModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { EssayService } from '../_services/essay.service';
import {MaterializeModule} from 'angular2-materialize';
import "materialize-css";

@NgModule({
  imports: [
    CommonModule,
    EssayRoutingModule,
    SharedModule,
    MatIconModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatProgressBarModule,
    MaterializeModule,
    MatOptionModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  declarations: [EssayCreateComponent, EssayDetailComponent, EssayListComponent],
  providers: [EssayService]
})
export class EssayModule {
}
