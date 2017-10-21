// ./table-layout/table-layout.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableLayoutComponent } from './table-layout.component';

import { CurrencyPipe } from '@angular/common';
import { StyleCellDirective } from './style-cell.directive';

import { FormatCellPipe } from '../_pipes/format-cell.pipe';

@NgModule({
    imports: [ CommonModule ],
    declarations: [ TableLayoutComponent,
    StyleCellDirective,
    FormatCellPipe ],
    exports: [
        CommonModule, 
        TableLayoutComponent 
    ],
    providers: [ CurrencyPipe ]
})

export class TableLayoutModule {

}