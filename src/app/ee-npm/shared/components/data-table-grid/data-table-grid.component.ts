import { Component, OnInit,Input,SimpleChange,ViewEncapsulation } from '@angular/core';

import {ColumnApi, GridApi, GridOptions} from "ag-grid/main";
import {CommonParsingService} from '../../../services/common/common.parsing.service';
// only import this if you are using the ag-Grid-Enterprise
import PerfectScrollbar from 'perfect-scrollbar';
import { ActivatedRoute, Router } from '@angular/router';
import RefData from "./refData";
import {CustomizedCellComponent} from "../customized-cell/customized-cell.component";
declare var $:any;
@Component({
  selector: 'app-data-table-grid',
  templateUrl: './data-table-grid.component.html',
  styleUrls: ['./data-table-grid.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class DataTableGridComponent  {

    public gridOptions: GridOptions;
    public icons: any;
    public rowData: any[];
    public columnDefs: any[];
    public rowCount: string;
 @Input() eventData: any;
  @Input() headers: any;
    private api: GridApi;
    private columnApi: ColumnApi;
    public style:any;
    public width:any;
    @Input() heightTable:any;
     @Input() widthTable:any;
    ps:any;
    component:any;
    constructor(private commonParsingService:CommonParsingService,private router:Router) {
        this.gridOptions = <GridOptions>{};

        this.icons = {
            columnRemoveFromGroup: '<i class="fa fa-remove"/>',
            filter: '<i class="fa fa-filter"/>',
            sortAscending: '<i class="fa fa-long-arrow-down"/>',
            sortDescending: '<i class="fa fa-long-arrow-up"/>',
            groupExpanded: '<i class="fa fa-minus-square-o"/>',
            groupContracted: '<i class="fa fa-plus-square-o"/>',
            columnGroupOpened: '<i class="fa fa-plus-square-o"/>',
            columnGroupClosed: '<i class="fa fa-minus-square-o"/>'
        };
       this.gridOptions.rowHeight = 34;
       this.gridOptions.headerHeight = 25;
        this.gridOptions.floatingFilter = true;
    }

ngOnChanges(changes: { [propKey: string]: SimpleChange }){
    this.style= {};
    if(changes["eventData"] ){
    this.rowData = this.createRowDataEvent();
        this.columnDefs = this.createColumnDefsEvent();
      
        if(this.rowData &&  this.rowData.length> 50){
            this.style.height=500;
            this.style.width = 900;
          
        }else{
              let height = this.gridOptions.rowHeight * this.rowData.length;
             this.style.height=height;
              if(height > 500){
             this.style.height=500;
              }
            if(this.columnDefs && this.columnDefs.length <5){
                this.style.width = 900;
            }else{
                 this.style.width = 900;
            }
        }
        if(this.router.url.match('/dashboard/')){
            this.style.height=340;
        }
        if(this.heightTable && this.heightTable!=0){
             this.style.height=this.heightTable;
        }
        if(this.widthTable && this.widthTable != 0){
            this.style.width = this.widthTable;
        }
    }

}
    createRowDataEvent(){
        for(let rows of this.eventData){
            if(rows["timestamp"].match('T')){
           rows["timestamp"] =  this.commonParsingService.formatDate(rows["timestamp"],undefined);
            }
        }
        return this.eventData;
    }

    createColumnDefsEvent(){
        let headersModified =[];

        if(this.headers){
        let headersLength =this.headers.length;
        for(let headers of this.headers){
            let obj={};
            obj["headerName"] = headers.displayName;
            obj["filter"] = headers.value;
            obj["filterParams"] = {clearButton: true};
            if(headers.children && headers.children.length > 0){
                obj["children"]=[];
                headers.children.forEach((e)=>{
                    let obj1={};
                    obj1["field"]=e.id.toString();
                    obj1["headerName"] =  e.displayName;
                    obj1["filter"] = e.value;
                     if(headers.children.length==1){
                        obj["width"] = 200;
                    }else{
                    obj1["width"] = 100;
                    }
                    obj["children"].push(obj1);
                })
                if(headers.children.length==1){
                    obj["width"] = 250;
                }
            }else{
                 obj["field"]=headers.id.toString();
                obj["width"] = headers.width;
                
            }
            
            
           
            if(this.router.url.match('dashboard')){
                obj["width"] = 150;
               if(!this.router.url.match('dashboardReport')){
                this.component = "dashboard";
                }else{
                     this.component = "others";
                }
            }else{
                this.component = "others";
            }
        if(headers.id=="timestamp") {
                obj["sort"] = 'desc';
                obj["filter"]= 'text';
                obj["width"] = 150;
            }
            obj["suppressMenu"] = true;
         headersModified.push(obj)  ;
        }
        }

        return headersModified;
    }

     onReady(params) {
        this.api = params.api;
        this.columnApi = params.columnApi;
        //$('span.ag-header-cell-text').attr('title',$('span.ag-header-cell-text').text());
    }

    viewportChanged(event){
     //this.ps.update($('.ag-body-viewport'));
    }

    ngAfterViewInit(){
    
  
    }

    setQuickFilter(search){
        this.gridOptions.api.setQuickFilter(search);
    }
    addTitleColumnHeader(){
        if( $('span.ag-header-cell-text') &&  $('span.ag-header-cell-text').length>0){
            let elem = $('span.ag-header-cell-text');
            $.each(elem,(i,span)=>{
                $(span).attr('title',$(span).text())
            })
        }
    }


    private createRowData() {
        const rowData: any[] = [];

        for (let i = 0; i < 20000; i++) {
            const countryData = RefData.countries[i % RefData.countries.length];
            rowData.push({
                name: RefData.firstNames[i % RefData.firstNames.length] + ' ' + RefData.lastNames[i % RefData.lastNames.length],
                skills: {
                    android: Math.random() < 0.4,
                    html5: Math.random() < 0.4,
                    mac: Math.random() < 0.4,
                    windows: Math.random() < 0.4,
                    css: Math.random() < 0.4
                },
                dob: RefData.DOBs[i % RefData.DOBs.length],
                address: RefData.addresses[i % RefData.addresses.length],
                years: Math.round(Math.random() * 100),
                proficiency: Math.round(Math.random() * 100),
                country: countryData.country,
                continent: countryData.continent,
                language: countryData.language,
                mobile: createRandomPhoneNumber(),
                landline: createRandomPhoneNumber()
            });
        }

        return rowData;
    }

    private createColumnDefs() {
        const columnDefs = [
            {
                headerName: '#',
                width: 30,
                checkboxSelection: true,
                suppressSorting: true,
                suppressMenu: true,
                pinned: true
            },
            {
                headerName: 'Employee',
                children: [
                    {
                        headerName: "Name",
                        field: "name",
                        width: 150,
                        pinned: true
                    },
                    {
                        headerName: "Country",
                        field: "country",
                        width: 150,
                        // an example of using a non-React cell renderer
                        cellRenderer: countryCellRenderer,
                        pinned: true,
                        filter: 'set',
                        filterParams: {
                            cellRenderer: countryCellRenderer,
                            cellHeight: 20
                        },
                        cellEditor: 'richSelect',
                        cellEditorParams: {
                            values: ["Argentina", "Brazil", "Colombia", "France", "Germany", "Greece", "Iceland", "Ireland",
                                "Italy", "Malta", "Portugal", "Norway", "Peru", "Spain", "Sweden", "United Kingdom",
                                "Uruguay", "Venezuela", "Belgium", "Luxembourg"],
                            cellRenderer: countryCellRenderer,
                        },
                        editable: true
                    },
                    {
                        headerName: "Date of Birth",
                        field: "dob",
                        width: 110,
                        pinned: true,
                        cellRenderer: function (params) {
                            return pad(params.value.getDate(), 2) + '/' +
                                pad(params.value.getMonth() + 1, 2) + '/' +
                                params.value.getFullYear();
                        },
                        filter: 'date',
                        columnGroupShow: 'open'
                    }
                ]
            },
            {
                headerName: "Proficiency",
                field: "proficiency",
                width: 135,
                // supply an angular component
                cellRendererFramework: CustomizedCellComponent
            },
            {
                headerName: 'Contact',
                children: [
                    {headerName: "Mobile", field: "mobile", width: 150, filter: 'text'},
                    {headerName: "Landline", field: "landline", width: 150, filter: 'text'},
                    {headerName: "Address", field: "address", width: 500, filter: 'text'}
                ]
            }
        ];

        return columnDefs;
    }
}

function countryCellRenderer(params) {
    const flag = "<img border='0' width='15' height='10' style='margin-bottom: 2px' src='https://www.ag-grid.com/images/flags/" + RefData.COUNTRY_CODES[params.value] + ".png'>";
    return flag + " " + params.value;
}

function createRandomPhoneNumber() {
    let result = '+';
    for (let i = 0; i < 12; i++) {
        result += Math.round(Math.random() * 10);
        if (i === 2 || i === 5 || i === 8) {
            result += ' ';
        }
    }
    return result;
}

//Utility function used to pad the date formatting.
function pad(num, totalStringSize) {
    let asString = num + "";
    while (asString.length < totalStringSize) asString = "0" + asString;
    return asString;
}
