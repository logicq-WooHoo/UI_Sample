import { Component, OnInit, SimpleChange, Input, EventEmitter, Output } from '@angular/core';
import { GetreportService } from '../services/http/report/getreport.service';
import { CommonParsingService } from '../services/common/common.parsing.service';
import { CommonGetterSetterService } from '../services/common/common.getterSetter.service';
import { MenuService } from '../services/menu/menu.service';
import { AppConfig } from '../../configurations/app.config';
import { ConfigService } from '../services/config/config.service';
import { Observable, Subscription } from 'rxjs';
import { CommonHighchartsOptionsService } from '../services/common/common.highcharts.options.service';
import { Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartTableService } from '../services/http/chart-table/chart-table.service';
declare var $: any;
@Component({
  selector: 'app-chart-table',
  templateUrl: './chart-table.component.html',
  styleUrls: ['./chart-table.component.css'],
  providers: [ChartTableService]
})
export class ChartTableComponent implements OnInit {


  @Input() refreshContinously: boolean;
  @Input() tableResponse = { headers: [], data: [], subElements: [] };
  @Input() response: any;
  @Input() eventData: any;
  @Input() headers: any;
  @Input() type: any;
  @Input() menuToggle: any;
  @Output() emitRefreshedData = new EventEmitter<any>();
  @Input() index: any = 0;
  @Input() showGraph: any;
  @Output() emitSubElement = new EventEmitter<any>();
  @Input() tableSearch: any;
  @Input() name: any;
  @Input() height: any;
  @Input() request:any;
  exportFileTypes: any;
  exportType: string;
  refreshInterval = this.configService.getConfiguration().refreshInterval;
  restCall = this.configService.getConfiguration().httpRestCall;
  dataTable: any;
  sortState: any;
  toggleGraphView: boolean = true;
  chart: any;
  showPopup: any;
  popUpIndex; any;
  heightTable: any;
  widthTable: any
  timerSubscription: Subscription;
  dimensionValue :any =[];
   dimensionKeys :any =[];
   showchartTypeSelect:any=false;
   isDashboardReport:boolean=false;
  constructor(private router: Router, private getreportService: GetreportService, private commonParsingService: CommonParsingService, private appConfig: AppConfig, private menuService: MenuService, private commonGetterSetterService: CommonGetterSetterService, private commonHighchartsOptionsService: CommonHighchartsOptionsService, private configService: ConfigService, private chartTableService: ChartTableService) { }


  ngOnInit() {
    this.exportFileTypes = ["CSV", "PDF", "XLS"];
    this.dataTable = 'grid';

    if (this.router.url.match('/dashboardReport/') || this.router.url.match('/dashboard/')) {
      this.toggleGraphView = true;
      this.isDashboardReport=true;

    } else {
      if(this.showGraph){
         this.toggleGraphView = true;
      }
      //this.toggleGraphView = false;
    }

  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes["eventData"]) {
      if(this.response.graphData){
      this.dimensionValue=this.response.graphData && this.response.graphData .propertyValuesMap ? this.response.graphData .propertyValuesMap : [];
      this.dimensionKeys=[];
      for(let keys in this.dimensionValue){
        this.dimensionKeys.push(keys);
      }
      }
      // this.refreshData();
    }
  }

  refreshData() {
    // if (this.refreshContinously && this.restCall) {
    //   let request = this.getreportService.getColumnReportRequest();
    //   if (request) {
    //     request.jsonString["intervals"] = this.getInterval(request);
    //     request.refreshedData = true;
    //     this.getreportService.getSpecificReport(request).subscribe(data => {
    //       if (data && data.response && data.response[0] && data.response[0].events && data.response[0].events.length > 0) {
    //         this.emitRefreshedData = data;
    //        data["refreshedData"] = true;
    //         //this.response = data;
    //         let tableResponse = this.commonParsingService.parseRestTableResponse(data);
    //         if (tableResponse.data != undefined && tableResponse.data.length > 0) {
    //           for (let values of tableResponse.data) {

    //             this.eventData.data.unshift(values);


    //           }
    //         }


    //       }
    //     });

    //     this.subscribeToData();

    //   }
    // }


    let data: any = this.chartTableService.refreshData();
    this.emitRefreshedData = data.response[0].seriesData;
    let tableResponse = this.commonParsingService.parseRestTableResponse(data);
    if (tableResponse.data != undefined && tableResponse.data.length > 0) {
      for (let values of tableResponse.data) {
        this.eventData.data.unshift(values);
      }
    }
    this.subscribeToData();
  }

  getInterval(request) {
    let intervals = request.jsonString["intervals"].split("/");
    let toDate: Date = new Date(intervals[1]);
    let toDateExtended = new Date(toDate.getTime() + this.refreshInterval);
    return toDate.toISOString() + "/" + toDateExtended.toISOString();
  }

  subscribeToData() {
    this.timerSubscription = Observable.timer(this.refreshInterval).first().subscribe(() => this.refreshData());
  }

  updateSortState(value) {
    this.sortState = value;
  }

  subElementForNode(node) {
    this.emitSubElement.emit(node);
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    $('#myModal' + this.index).on('hidden.bs.modal', () => {
      this.popUpIndex = "";
      this.showPopup = false;
      this.heightTable = 0;
      this.widthTable = 0;
    })
   
    // setTimeout(()=>{
    //   this.subscribeToData();
    // },30000);
  }
showDropdown(event) {
    let elem: any = $(event.currentTarget).siblings('div.drop-list');
    let elem1: any = $(event.currentTarget).parents('a').siblings('div.drop-list');
     $(event.currentTarget).siblings('span.clear-btn').removeClass('hide');
    // let elem1: any = $(event.currentTarget).parents('div.form-group').siblings().children('div.dropdown');
    console.log(elem1);
    if (elem && elem.length > 0)
      elem.removeClass('hide').addClass('show');
    if (elem1 && elem1.length > 0)
      elem1.removeClass('hide').addClass('show');
  }

  hideDropdown(event) {
    $(event.currentTarget).siblings('div.drop-list').removeClass('show').addClass('hide');
  }
  cleardata(value) {
    if (value == "true") {
      this.exportType = "";
    }
  }

  getSpecificReport()
  { 
    if(null != this.response)
    {
      this.router.navigate(['/report/' + this.response.userTemplateId + '/dashboardReport']);
    }

  }
}
