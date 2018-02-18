import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @Input() eventData: any;
  @Input() headers: any;
  @Input() pagination: boolean;
  sortByName: any;
  @Output() sortState = new EventEmitter();
  timezone: any;
  columnsArray: any;
  pageSizeSelected: number;
  currentPage: number = 1;
  pageToDisplay : number ;
  @Output() showSubElement =new EventEmitter();
  @Input() showAnchoredSubElement = false;
  @Input() search:any;
  @Output() selectedKpiId = new EventEmitter();
  
   
  ngOnInit() {
    this.timezone = "BST";
    this.sortByName = '-timestamp';
    this.pageChanged({ page: 1 });
  }
  ngOnChanges() {
    this.sortState.emit(this.sortByName);
    this.columnsArray = this.headers;
    if (this.pagination && this.headers && this.eventData) {
      this.columnsArray = this.headers.slice(0);
      this.pageSizeSelected = 20;
      this.pageChanged({ page: 1 });
    }
  }

  showSubElements(value){
    this.showSubElement.emit(value);
  }

  fetchDataBySorting(event, name) {
    let sortType: string;
    if (!$(event.currentTarget).parent().hasClass("ascending")) { //Ascending
      $(event.currentTarget).parent().addClass("ascending");
      $(event.currentTarget).parent().removeClass("descending");
      sortType = '+';
    } else {  //Descending
      $(event.currentTarget).parent('.ascending').toggleClass("descending");
      $(event.currentTarget).parent('.descending').removeClass("ascending");
      sortType = '-';
    }
    this.sortByName = sortType + name;
  }

  pageChanged(event: any) {
    if (this.pagination && this.pageSizeSelected) {
      this.currentPage = event.page;
      let k: number = 0;
      if (this.currentPage != 1) {
        k = (this.currentPage - 1) * this.pageSizeSelected.valueOf();
      }
      this.columnsArray = [];
      let lastIndex: number = k + this.pageSizeSelected.valueOf();
      for (var j = 0; j < this.pageSizeSelected; j++) {
        if (this.headers[j + k] != undefined)
          this.columnsArray.push(this.headers[j + k]);
      }
      this.pageToDisplay = k;
    }else {

    }
  }

  selectKPI(object){
    this.selectedKpiId.emit(object);
  }

}
