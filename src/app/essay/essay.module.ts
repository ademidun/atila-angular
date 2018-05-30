import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EssayRoutingModule } from './essay-routing.module';
import { EssayCreateComponent } from './essay-create/essay-create.component';
import { EssayDetailComponent } from './essay-detail/essay-detail.component';
import { EssayListComponent } from './essay-list/essay-list.component';
import {SharedModule} from '../_shared/shared.module';
import {MatIconModule} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    EssayRoutingModule,
    SharedModule,
    MatIconModule,
  ],
  declarations: [EssayCreateComponent, EssayDetailComponent, EssayListComponent]
})
export class EssayModule { }
