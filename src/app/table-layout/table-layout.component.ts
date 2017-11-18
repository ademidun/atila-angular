import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
//See: https://medium.com/@ct7/building-a-reusable-table-layout-for-your-angular-2-project-adf6bba3b498
import { Project, Person, ColumnSetting, ColumnMap } from '../table-layout/models';

@Component({
  selector: 'my-table',
  templateUrl: './table-layout.component.html',
  styleUrls: ['./table-layout.component.scss']
})

export class TableLayoutComponent implements OnChanges { 
  @Input() records: any[];
  @Input() caption: string;
  @Input() settings: ColumnSetting[];
  @Output() tableEditEvent:EventEmitter<any[]>  = new EventEmitter<any[]>();
  columnMaps: ColumnMap[]; 
  
  ngOnChanges() {
    //For each column setting value, create a Column Map instance to configure the column                                                               
      if (this.settings) { // when settings provided
          this.columnMaps = this.settings
                        .map(col => new ColumnMap(col));
      }
      else { // no settings, create column maps with defaults

        //Each key in scholarship.submission_info.web_form_entries is a column header
          this.columnMaps = Object.keys(this.records[0])
              .map( key => { //for each key item, return an object of primaryKey and header field
                   return new ColumnMap({primaryKey: key})
          });
      }


    
  }

  editRow(index: number){
    
  }
  
  deleteRow(index: number){

    
    this.records.splice(index,1);
    this.sendEdits();
  }

  addRow(){
    //Add a row as a dictionary, where each key corresponds to a column.
    
    let rowItem = {};

    this.columnMaps.forEach( 
      column => rowItem[column.primaryKey]= '' 
    )
    

    this.records.push(rowItem);

  }
  sendEdits() {
    
    this.tableEditEvent.emit(this.records)
  }



}
