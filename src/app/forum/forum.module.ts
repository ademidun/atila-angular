import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumRoutingModule } from './forum-routing.module';
import {ForumDetailComponent} from './forum-detail/forum-detail.component';
import {ForumsListComponent} from './forums-list/forums-list.component';

@NgModule({
  imports: [
    CommonModule,
    ForumRoutingModule
  ],
  declarations: [ForumDetailComponent, ForumsListComponent]
})
export class ForumModule { }
