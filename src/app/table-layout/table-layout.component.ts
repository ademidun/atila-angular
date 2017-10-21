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
          this.columnMaps = Object.keys(this.records[0])
              .map( key => { //for each key item, return an object of primaryKey and header field
                   return new ColumnMap({primaryKey: key})
          });
      }
  }

  editRow(index: number){
    console.log('editRow index: ', index);
  }
  
  deleteRow(index: number){

    console.log('deleteRow index: ', index);
    this.records.splice(index,1);
    this.sendEdits();
  }

  addRow(){
    let rowItem = {};

    this.columnMaps.forEach( 
      column => rowItem[column.primaryKey]= '' 
    )
    console.log('addRow rowItem: ', rowItem)

    this.records.push(rowItem);

  }
  sendEdits() {
    var sendData = this.records;
    console.log('sendEdits() sendData: ', sendData);
    this.tableEditEvent.emit(sendData)
  }


}
