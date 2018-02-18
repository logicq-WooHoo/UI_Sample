import { Component, OnInit, AfterViewInit, EventEmitter, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/core';
import { NewReportModel } from './newreport.model';
import counterGroup from './counterGroup.model';
import { GetreportService } from '../services/http/report/getreport.service';
import { KpiService } from '../services/http/kpi/kpi.service';
import { CommonParsingService } from '../services/common/common.parsing.service';
import { CommonFieldErrorUtilService } from '../services/common/common.field-error.util';
import { CommonGetterSetterService } from '../services/common/common.getterSetter.service';
import { MenuService } from '../services/menu/menu.service';
import { AppConfig } from '../../configurations/app.config';
import { ConfigService } from '../services/config/config.service';
import { DataLoadSpinner } from '../services/dataLoadSpinner.service';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/takeWhile';
import PerfectScrollbar from 'perfect-scrollbar';
declare var $: any;
declare var require: any;
const Highstock = require('highcharts/highstock.src');
require('highcharts/modules/exporting.js')(Highstock);
require('highcharts/modules/offline-exporting.js')(Highstock);

@Component({
  selector: 'app-report-widget',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css'],
  animations: [
    trigger('collapseAnimation', [
      state('true', style({ overflow: 'hidden', height: '0px', opacity: '0', border: '1px solid #ddd' })),
      state('false', style({ overflow: 'visible', height: '*', opacity: '1' })),
      transition('false => true', animate('400ms')),
      transition('true => false', animate('400ms'))
    ]),
    trigger('headingAnimation', [
      state('false', style({ padding: '3px 10px' })),
      state('true', style({})),
      transition('true <=> false', animate('400ms'))
    ])
  ],

  providers: [FormBuilder, NewReportModel, CommonFieldErrorUtilService],
})


export class CreateReportComponent implements OnInit, AfterViewInit {

  public newReportModel: NewReportModel = new NewReportModel();
  public intervalValue: string;
  public durationType: string;
  public selectedDuration: any;
  public availableTags: Array<string>;
  public filterString: any;
  public filterStringForRequest: any;
  public dashboardId: any;
  public newReportForm: FormGroup;
  public fromDate: Date = new Date();
  public toDate: Date = new Date();
  public counterGroup = counterGroup;
  public controlgroup: any;
  public testing: string;
  public controlGroupCounter: any = { displayName: undefined };
  public counterIds: any = [];
  public tableResponse: any = { headers: [], data: [] };
  public tableResponseheaders: any;
  public TriggeredSave: boolean = false;
  public submitForm: boolean = false;
  public SamplingPeriodList: Array<any>;
  public durationList: any;
  public fromDateUpdated: Date;
  public toDateUpdated: Date;
  public sortState: string = '+timestamp';
  public detailedResponseArray: any = [];
  public counterGroupPopUp = { counterList: undefined, showMoreItems: false, searchProp: "", properties: [], counterGroupId: undefined, };
  public counterGroupKPIPopUp = { searchProperties: "", properties: [], kpis: undefined, counterGroupId: undefined, showEnable: false, showAllProps: false, typeShown: "", searchKPI: "", showAll: false };
  public deviceTypeModel: any = { deviceTypeModel: undefined };
  i: number = 0;
  str: string = "";
  internalRuleString: string = "";
  public nodes: Array<any> = [];
  //public deviceTypeModel  = { "deviceType" : undefined};
  public response: any;
  public counterGroupCounters = [];
  public counterGroupMap: Map<any, any> = new Map();
  timerSubscription: Subscription;
  public refreshDataContinuously: boolean = false;
  public refreshInterval: number;
  public menuToggled: boolean;
  public counterGroupsDisplay = [];
  public counterGroupsEnabled = { kpi: [], counters: [] };
  public countersDisplay = [];
  public counterGroupModel = "";
  public counterLoading: boolean;
  public elements: any;
  public element: any;
  public selectAllMetrics1: any;
  public selectAllMetrics: any;
  offset = this.configService.getConfiguration().offset;
  offsetHours = this.configService.getConfiguration().offsetHours;
  countersAllowed = this.configService.getConfiguration().countersAllowedGroupBy;
  propertiesAllowed = this.configService.getConfiguration().propertiesAllowedGroupBy;
  public subElement: any;
  public subElementAdded: any = { displayName: "" };
  public tableDetailedResponse: any;
  public responseDetailed: any;
  public counterGroupIds = [];
  public clickedIndex = 0;
  public searchCG: string;
  public countersInCG: any = [];
  public kpisInCG: any = [];
  public kpiList = [];
  public kpiListChecked = [];
  public kpiResponse = [];
  public kpiTableResponse = { headers: [], data: [] };
  public showGraph = true;
  public searchData: any;
  public levels = [];
  public level: any;
  public exportType: any;
  public tabSelected: any;
  public editReportModel: any;
  public editReport: any = false;
  public ps: any;
  public isCollapsed: boolean = false;
  public requestFilterMap: Map<string, string> = new Map();
  public reportDataType: string = "raw";
  public properties: any = [];
  public scrollLists: any;
  public deviceTypeModelRequest: any;
  reportTypeConfigList = [{
    type: "Table", class: "icon-24 table-icon", subtype: [{ name: "Table", image: "./assets/images/table-table.png" }
    ]
  }, { type: "Graph", class: "icon-24 graphs-icon", subtype: [{ name: "line", image: "./assets/images/line-chart.png" },{ name: "Spline", image: "./assets/images/graph-icon.png" }, { name: "Bar", image: "/assets/images/vertical-bar.png" }, { name: "Vertical Stacked Bar", image: "./assets/images/vertical-stacked-bar6.png" }, { name: "Horizontal Stacked Bar", image: "./assets/images/horizontal-stacked-bar2.png" }, { name: "Horizontal Bar", image: "./assets/images/horizontal-bar4.png" }] }, { type: "TopN", class: "icon-24 top-icon", subtype: [{ name: "Time Ratio Bar", image: "./assets/images/pie-chart2.png" }] }]
  //constructor(  formBuilder: FormBuilder ,private getreportService : GetreportService ,private reportModel :NewReportModel, private menuService : MenuServiceService,private router : Router ,private localstorageService:LocalStorageService,private route: ActivatedRoute,private location:Location)
  constructor(formBuilder: FormBuilder, private getreportService: GetreportService, private commonParsingService: CommonParsingService, private appConfig: AppConfig, private menuService: MenuService, private commonGetterSetterService: CommonGetterSetterService, private reportModel: NewReportModel, private configService: ConfigService, private _spinner: DataLoadSpinner, private kpiService: KpiService, public commonFieldErrorUtilService: CommonFieldErrorUtilService, private localStorageService: LocalStorageService
    , private router: Router, private route: ActivatedRoute) {
    this.refreshInterval = this.configService.getConfiguration().refreshInterval;

    this.newReportForm = formBuilder.group({
      "ReportSource": [],
      "ReportTitle": "",
      "ReportType": {
        "type": "Table",
        "subType": "Table",
      },
      "graphType": "Line",
      "properties": [],
      "granularity": ["All"],
      "filterExpression": "",
      "aggregation": ["SUM"],
      "metric": ["Availability"],
      "filterfield": "",
      "FilterFieldValue": "",
      "fromDate": this.commonParsingService.formatDate(new Date(), this.offset, this.offsetHours),
      "toDate": this.commonParsingService.formatDate(new Date(), this.offset),
      "threshold": "10",
      "duration": "Custom",
      "timestring": "Last",
      "timerange": "15 minutes",
      "samplingPeriod": "15 minutes",
      "counterGroups": formBuilder.group({
        displayName: undefined

      }),
      "device": "",
      "counter": formBuilder.group({
        displayName: undefined

      }),
    });

    this.commonFieldErrorUtilService.setForm(this.newReportForm);

  }

  ngOnInit() {

    this.newReportModel.aggregationTypes = this.reportModel.aggregationTypes;
    this.newReportModel.timeRangeList = this.reportModel.timeRangeList;
    this.menuService.getToggledValue().subscribe((data) => {
      this.menuToggled = data.value;
      // this._chart.redraw();
    });
    this.editReportModel = this.route.snapshot.data['configuration'];
    if (this.editReportModel) {
      this.editReport = true;
      this.newReportForm.controls["ReportTitle"].setValue(this.editReportModel.configuration.name);
      this.newReportForm.controls["ReportType"].setValue(this.editReportModel.configuration.type);
      this.newReportForm.controls["granularity"].setValue(this.editReportModel.granularity);
      this.selectDeviceType(this.editReportModel.configuration.deviceType);

    } else {

    }
    this.getreportService.getDevices().subscribe(data => {
      if (data) {
        this.elements = data;
        // this.devices = data;
      }
    }, (err) => {
      console.log(err);
    });


  }

  selectedSubElement(value) {
    this.subElement = [];
    this.subElementAdded.displayName = "";
    let request = { counterGroups: [] };
    for (let counterGroupIds of this.counterGroupIds) {
      request.counterGroups.push({ "counterGroupId": counterGroupIds });

    }
    let nodeId;
    for (let node of this.nodes) {
      if (node.elementUserLabel == value) {
        nodeId = node.elementID;
      }
    }
    request["deviceType"] = this.element;
    request["elements"] = [];
    request["elements"].push({
      "elementID": nodeId
    })
    if (this.kpiListChecked && this.kpiListChecked.length > 0) {
      request["kpiList"] = [];
      for (let kpis of this.kpiListChecked) {
        request["kpiList"].push({ displayName: kpis.displayName });
      }
    }
    this.getreportService.getSubElementsFromNodes(request).subscribe(data => {
      this.subElement = data;
    }, (err) => {
      console.log(err);
    });
  }

  showCustomScrollbar(id) {
    $(id).mCustomScrollbar({
      theme: "minimal-dark",
      advanced: {
        autoScrollOnFocus: false,
        updateOnContentResize: true
      }
    });
  }

  trackByFunct(index, counter) {
    return counter.counterId;
  }

  gotoReportGeneration(id) {
    $('#' + id).click();
  }

  ngAfterViewInit() {
    //$(".help").popover({ trigger: "hover" });
    let date = new Date();
    let fromdate: any = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, date.getHours(), date.getMinutes(), date.getSeconds());
    let date1 = new Date();
    let todate: any = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate(), date1.getHours(), date1.getMinutes(), date1.getSeconds());

    // $("#datePicker").on('click', (e, args) => {
    //   $("#datePicker").datetimepicker("show");
    // });

    this.showCustomScrollbar('ul.dropdown-overflow,.scroll-tab-content');



    $("#datePicker").datetimepicker({
      value: fromdate,
      format: 'dd-mm-yy',
      maxDate: 0,
      changeYear: true,
      autoclose: true

    });
    // $("#datePicker").datetimepicker("setDate",this.formatDate(fromdate,'previous'));
    $("#datePicker").on('change', (e, args) => {
      this.newReportForm.controls["fromDate"].setValue($("#datePicker").val());
    });



    $("#todatePicker").datetimepicker({
      format: 'dd-mm-yy', value: todate,
      maxDate: 0,
      changeYear: true,
      autoclose: true
    });

    $("#todatePicker").on('change', (e, args) => {
      this.newReportForm.controls["toDate"].setValue($("#todatePicker").val());
    });





    let parent = this;
    $('.dropdown').on({
      focus: function () {
        $(this).siblings('div.drop-list').removeClass('hide');
        $(this).siblings('span.clear-btn').removeClass('hide');
        $(this).siblings('div.drop-list').addClass('show');
        if ($(this).parents('div.form-group').siblings().children('div.dropdown').length > 0) {
          if ($(this).parents('div.form-group').siblings().children('div.dropdown').find('div.drop-list').hasClass('show')) {
            $(this).parents('div.form-group').siblings().children('div.dropdown').find('div.drop-list').removeClass('show');
            $(this).parents('div.form-group').siblings().children('div.dropdown').find('div.drop-list').addClass('hide');
          }
        }
        parent.showCustomScrollbar('ul.dropdown-overflow');
      }
    }).blur(function () {
      if ($('div.drop-list:hover') && $('div.drop-list:hover').length == 0) {
        $(this).siblings('div.drop-list').removeClass('show');
        $(this).siblings('div.drop-list').addClass('hide');

      }

      if ($('span.clear-btn:hover') && $('span.clear-btn:hover').length > 0) {
        $(this).focus();
      } else {
        $(this).siblings('span.clear-btn').addClass('hide');
      }
    });



  }



  getObjectOfRequest(element, value) {
    let obj = {
      "type": "selector",
      "field": element,
      "value": value
    }
    return obj;
  }


  clearResponse() {
    this.response = [];
    this.tableResponse = { headers: [], data: [] };
    this.detailedResponseArray = [];
    this.kpiResponse = [];
    this.kpiTableResponse = { headers: [], data: [] };;
  }


  public createOrUpdateReport() {
    this.clearResponse();
    let counters = [];
    this.fromDateUpdated = new Date(this.newReportForm.controls["fromDate"].value + ' GMT');
    this.toDateUpdated = new Date(this.newReportForm.controls["toDate"].value + ' GMT');
    this.TriggeredSave = true;
    let errorCount = 0;
    let request: any = this.newReportModel.reportRequest;
    let counterIdArray = [];
    let dimensions = [];
    this.detailedResponseArray = [];
    let counterGroupArray = this.getCounterGroupArray();
    if (this.counterIds && this.counterIds.length > 0) {
      for (let ids of this.counterIds) {
        let obj = {};
        obj["id"] = ids;
        counterIdArray.push(obj);
      }
      request.jsonString.configuration.metrics = counterIdArray;
      request.jsonString.configuration.kpiMetrics = null;
    }

    // else {
    //   for (let ids of this.kpiListChecked) {
    //     let obj = {};
    //     obj["id"] = ids;
    //     counterIdArray.push(obj);
    //   }
    //   request.jsonString.configuration.kpiMetrics = counterIdArray;
    //   request.jsonString.configuration.metrics = null;
    // }

    if (this.properties && this.properties.length > 0) {
      for (let name of this.properties) {
        let obj = {};
        obj["id"] = name;
        obj["name"] = name;

        dimensions.push(obj);
      }
    }
    request.jsonString.configuration.dimensions = dimensions;
    request.jsonString.configuration.name = this.newReportForm.controls["ReportTitle"].value;
    request.jsonString.configuration.type = (this.newReportForm.controls["ReportType"].value).type;

    if ((this.newReportForm.controls["ReportType"].value).type == 'Graph' || (this.newReportForm.controls["ReportType"].value).type == 'TopN') {
      if (this.counterIds.length > this.countersAllowed) {
        this._spinner.showErrorMessage("Select only " + this.countersAllowed + " counters/kpis for a graph report");
        return false;
      } else if (this.properties.length > this.propertiesAllowed) {
        this._spinner.showErrorMessage("Select only " + this.propertiesAllowed + " properties for a graph report");
        return false;
      }
    }
    request.jsonString.configuration.subType = (this.newReportForm.controls["ReportType"].value).subType;
    request.jsonString.configuration.deviceType = this.element;

    request.jsonString.intervals = this.getTimeStringInterval();

    if (null != this.newReportForm.controls["granularity"].value) {
      let granularity: string = this.newReportForm.controls["granularity"].value;
      request.jsonString.granularity = granularity.toUpperCase();
    }

    if (this.deviceTypeModel.elementUserLabel != "All Nodes") {

      this.requestFilterMap.set("NodeName", this.deviceTypeModel.elementUserLabel);
    } else {
      if (null != this.requestFilterMap && null != this.requestFilterMap.get("NodeName")) {
        this.requestFilterMap.delete("NodeName");
      }
    }
    let filterObject: any = {};
    if (null != this.requestFilterMap) {
      this.requestFilterMap.forEach((v, k) => {
        filterObject[k] = v;
      });
    }

    request.userName = this.localStorageService.get('userName');
    request.jsonString.pagination.pagesize = 10000;
    request.jsonString.filterMap = filterObject;
    request.jsonString.reportDataType = this.reportDataType;

    this.getreportService.setColumnReportRequest(request);

    this.tableResponse = { headers: [], data: [], showSubElementsAnchored: false };
    this.response = [];
    console.log(request);
    this.getreportService.getSpecificReport(request).subscribe(data => {

      if (data && this.kpiListChecked.length > 0) {
        this.tableResponse = this.commonParsingService.parseRestKPITableResponse(data);
      } else {
        this.tableResponse = this.commonParsingService.parseRestTableResponse(data);
      }
      this.response = data;
      this.tableResponse.showSubElementsAnchored = true;
      this.showGraph = (this.newReportForm.controls["ReportType"].value).type == 'Table' ? false : true;
      this._spinner.hide();

      this.refreshDataContinuously = this.appConfig.refreshContinuously;
    }, (err) => {
      console.log(err);
    });
  }

  showTab(id) {
    $("#" + id).fadeIn();
    $('a.' + id).parents(".reportMenu").find('li').removeClass("active");
    if (!$('a.' + id).hasClass("disabled")) {
      $('a.' + id).parents(".reportMenu li").addClass("active");
    }


  }

  showPageAction() {
    $('div.page-action').toggle('slide', { "direction": "right" });
    this.isCollapsed = !this.isCollapsed;
  }


  public getTimeStringInterval() {
    if (this.newReportForm.controls["timestring"].value == 'Custom') {
      return this.getInterval();
    } else {
      let time = [this.newReportForm.controls["timestring"].value, this.newReportForm.controls["timerange"].value].join(' ');
      return time;
    }
  }

  public getInterval() {
    let interval = "";
    let date: Date = new Date(this.newReportForm.controls["fromDate"].value + ' GMT');
    let date2: Date = new Date(this.newReportForm.controls["toDate"].value + ' GMT');
    interval = date.toISOString() + '/' + date2.toISOString();
    return interval;
  }

  public getFilter() {

    let rules = $('#builder-basic').queryBuilder('getRules');
    if (rules != null && $.isEmptyObject(rules)) {
      rules = null;
    }

    return rules;
  }





  public getConfiguration() {

  }


  generatePreviousUTCDate() {
    let currentDate: Date = new Date();
    var day = currentDate.getUTCDate() - 1;
    var month = currentDate.getUTCMonth() + 1;
    var year = currentDate.getUTCFullYear();
    var hour = currentDate.getUTCHours();
    var minutes = currentDate.getUTCMinutes();
    var seconds = currentDate.getUTCSeconds();
    return new Date(year, month, day, hour, minutes, seconds);
  }




  generatePreviousDate() {
    let currentDate: Date = new Date();
    var day = currentDate.getDate() - 1;
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var hour = currentDate.getHours();
    var minutes = currentDate.getMinutes();

    return month + '/' + day + '/' + year + ' ' + '00:00';
  }


  updateRule() {
    this.str = "";
    var result = $('#builder-basic').queryBuilder('getRules');
    if (!$.isEmptyObject(result)) {
      // this.filterString = this.createRule(result);
    } else {
      this.filterString = "";
    }
  }








  changeValue(val) {
    if (val.isCollapsed == 'true') {
      val.isCollapsed = 'false';

    } else {
      val.isCollapsed = 'true';
    }

  }
  public getValuesList(element, inputElement) {
    let pattern: string = inputElement.val();
    let property = element.queryBuilderModel.__.filter;
    if (pattern == "") {
      pattern = null;
    }

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

  hideDropdownClick(event) {
    $(event.currentTarget).parents('div.drop-list').removeClass('show').addClass('hide');
  }



  generateCurrentUTCDate() {
    let currentDate: Date = new Date();
    var day = currentDate.getUTCDate();
    var month = currentDate.getUTCMonth() + 1;
    var year = currentDate.getUTCFullYear();
    var hour = currentDate.getUTCHours();
    var minutes = currentDate.getUTCMinutes();
    var seconds = currentDate.getUTCSeconds();
    return new Date(Date.UTC(year, month, day, hour, minutes, seconds));
  }


  generateCurrentDate() {
    let currentDate: Date = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var hour = currentDate.getHours();
    var minutes = currentDate.getMinutes();
    return month + '/' + day + '/' + year + ' ' + '00' + ':' + '00';
  }



  setSamplingPeriodforEditReport(samplingPeriod) {

    if (this.SamplingPeriodList) {
      for (let samperiod of this.SamplingPeriodList) {
        if (samperiod.name == samplingPeriod.trim()) {
          // this.selectedsamplingPeriod = samperiod;
        }
      }
    }
    //this.newReportForm.controls["samplingPeriod"].setValue(this.selectedsamplingPeriod.displayName);
  }

  ValidateForm(obj) {
    // this.formFieldsMap.set(obj.key, obj.value);
  }



  public removelegendKeysFromErrorMap() {

  }

  assignvalue(control, event, obName) {
    this.newReportForm.controls[control].patchValue(event);
    if (control == 'counterGroups') {

    }
  }


  addKPIs(kpi, value, group?, counter?) {
    if (!counter) {
      if (kpi.id && value && this.kpiListChecked.indexOf(kpi.id) < 0) {
        this.kpiListChecked.push(kpi.id);
      } else if (kpi.id && !value && this.kpiListChecked.indexOf(kpi.id) >= 0) {
        this.kpiListChecked.splice(this.kpiListChecked.indexOf(kpi.id), 1);
      }
    }
    let groupId = group.counterGroupId;

    // if (value) {

    //   if (this.counterGroupIds.indexOf(groupId) < 0) {
    //     this.counterGroupIds.push(groupId);
    //   }
    //   let kpi1 = JSON.parse(JSON.stringify(kpi));
    //   let groups = JSON.parse(JSON.stringify(group));
    //   groups.kpiEnabled = [];
    //   let hasGroup = false;
    //   if (this.kpisInCG) {
    //     this.kpisInCG.forEach((e) => {
    //       if (e.counterGroupId == groupId) {
    //         hasGroup = true;
    //       }
    //     })
    //   }

    //   if (!hasGroup) {
    //     this.kpisInCG.push(groups);
    //   }
    //   if (this.counterGroupsEnabled.kpi.length == 0 && this.counterGroupsEnabled.counters.length == 0) {
    //     this.counterGroupsEnabled.kpi.push(groups);
    //     this.tabSelected = "kpi";
    //   } else {
    //     let hasGroupIdinKPI = false;
    //     this.counterGroupsEnabled.kpi.forEach((elem, i) => {
    //       if (elem.counterGroupId == groupId) {
    //         hasGroupIdinKPI = true;
    //       }
    //     })

    //     if (!hasGroupIdinKPI) {
    //       this.counterGroupsEnabled.kpi.push(groups);
    //     }
    //   }
    //   this.kpisInCG.forEach((e, i) => {
    //     if (e.counterGroupId == groupId) {
    //       e.kpiEnabled.push(kpi);
    //     }
    //   })

    // } else {
    //   kpi["showEnable"] = false;
    //   let i = 0;
    //   let index1; let removeGroup = false;;
    //   this.kpisInCG.forEach((e, i) => {
    //     if (e.counterGroupId == groupId) {
    //       index1 = i;
    //       let index;
    //       e.kpiEnabled.forEach((c, j) => {
    //         if (c.id == kpi.id) {
    //           index = j;
    //         }
    //       });
    //       e.kpiEnabled.splice(index, 1);
    //       if (e.kpiEnabled.length == 0) {
    //         removeGroup = true;
    //       }
    //     }
    //   })
    //   if (removeGroup) {
    //     this.kpisInCG.splice(index1, 1);
    //     let cg = {};
    //     if (this.countersInCG) {
    //       let cg = this.countersInCG.filter((cg) => {
    //         return cg.counterGroupId == groupId
    //       })
    //     }

    //     let counterEnabledPresent = false;
    //     if (cg["counterEnabled"]) {
    //       cg["counterEnabled"].forEach((c, j) => {
    //         counterEnabledPresent = true;
    //       })
    //     }


    //     if (!counterEnabledPresent) {
    //       this.counterGroupsEnabled.kpi = this.counterGroupsEnabled.kpi.filter((elem) => {
    //         return elem.counterGroupId != groupId;
    //       });
    //     }

    //  this.counterGroupsEnabled.counters = this.counterGroupsEnabled.counters.filter((elem)=>{
    //      return elem.counterGroupId!=groupId;
    //  });
    //}

    //}

  }
  addCounterIds(counter, value, group?, kpi?) {

    if (this.counterIds || this.counterIds.length == 0) {
      this.clearResponse();
    }
    let groupId = group.counterGroupId;
    if (counter.counterKey.counterId && this.counterIds.indexOf(counter.counterKey.counterId) < 0 && value) {
      this.counterIds.push(counter.counterKey.counterId);

    } else if (counter.counterKey.counterId && this.counterIds.indexOf(counter.counterKey.counterId) >= 0 && !value) {
      this.counterIds.splice(this.counterIds.indexOf(counter.counterKey.counterId), 1);

    }
    
    //  else if (counter.id && this.counterIds.indexOf(counter.id) < 0 && value) {
    //   this.counterIds.push(counter.id);

    // } else if (counter.id && this.counterIds.indexOf(counter.id) >= 0 && !value) {
    //   this.counterIds.splice(this.counterIds.indexOf(counter.id), 1);

    // }




    if (!kpi) {
      // if (value) {

      //   if (this.counterGroupIds.indexOf(groupId) < 0) {
      //     this.counterGroupIds.push(groupId);
      //   }
      //   let counters = JSON.parse(JSON.stringify(counter));
      //   let groups = JSON.parse(JSON.stringify(group));
      //   if (!groups.counterEnabled) {
      //     groups.counterEnabled = [];
      //   }
      //   let hasGroup = false;
      //   if (this.countersInCG) {
      //     this.countersInCG.forEach((e) => {
      //       if (e.counterGroupId == groupId) {
      //         hasGroup = true;
      //       }
      //     })
      //   }

      //   if (!hasGroup) {
      //     this.countersInCG.push(groups);
      //   }
      //   this.countersInCG.forEach((e, i) => {
      //     if (e.counterGroupId == groupId) {
      //       e.counterEnabled.push(counter);
      //     }
      //   })
      //   if (this.counterGroupsEnabled.kpi.length == 0 && this.counterGroupsEnabled.counters.length == 0) {
      //     this.counterGroupsEnabled.counters.push(groups);
      //     this.tabSelected = "counters";
      //   } else {
      //     let hasGroupIdinCounter = false;
      //     this.counterGroupsEnabled.counters.forEach((elem, i) => {
      //       if (elem.counterGroupId == groupId) {
      //         hasGroupIdinCounter = true;
      //       }
      //     })
      //     let hasGroupIdinKPI = false;

      //     if (!hasGroupIdinCounter) {
      //       this.counterGroupsEnabled.counters.push(groups);
      //     }
      //   }
      // } else {
      //   counter["showEnable"] = false;
      //   let i = 0;
      //   // for (let coutr of this.countersDisplay) {
      //   //   if (coutr.counterId == counter.counterId) {
      //   //     this.countersDisplay.splice(i, 1);
      //   //   }
      //   //   i++;
      //   // }

      //   let index1; let removeGroup = false;;
      //   this.countersInCG.forEach((e, i) => {
      //     if (e.counterGroupId == groupId) {
      //       index1 = i;
      //       let index;
      //       e.counterEnabled.forEach((c, j) => {
      //         if (c.counterId == counter.counterId) {
      //           index = j;
      //         }
      //       });
      //       e.counterEnabled.splice(index, 1);
      //       if (e.counterEnabled.length == 0) {
      //         removeGroup = true;
      //       }
      //     }
      //   })
      //   if (removeGroup) {
      //     this.countersInCG.splice(index1, 1);
      //     // this.counterGroupsEnabled.kpi = this.counterGroupsEnabled.kpi.filter((elem)=>{
      //     //      return elem.counterGroupId!=groupId;
      //     //  });
      //     let cg = {};
      //     if (this.kpisInCG) {
      //       let cg = this.kpisInCG.filter((cg1) => {
      //         return cg1.counterGroupId == groupId
      //       })
      //     }

      //     let kpiEnabledPresent = false;
      //     if (cg["kpiEnabled"]) {
      //       cg["kpiEnabled"].forEach((c, j) => {
      //         kpiEnabledPresent = true;
      //       })
      //     }
      //     if (!kpiEnabledPresent) {
      //       this.counterGroupsEnabled.counters = this.counterGroupsEnabled.counters.filter((elem) => {
      //         return elem.counterGroupId != groupId;
      //       });
      //     }
      //   }

      //   if (this.counterGroupIds.indexOf(groupId) >= 0) {
      //     this.counterGroupIds.splice(this.counterGroupIds.indexOf(groupId), 1);
      //   }
      // }
    } else {
      this.addKPIs(counter, value, group, 'counter');
    }

  }

  hideDropdownDrop(event) {
    $(event.currentTarget).parents('div.drop-items').addClass("hide").removeClass("show");

  }

  enabledCounterGroup(group, clss?, key?) {

    if ($('a#' + group.counterGroupId + key).hasClass(clss)) {
      return true;
    } else {
      return false;
    }

  }


  clearCounterIds(counterGroup1) {
    this.controlgroup = JSON.parse(JSON.stringify(counterGroup1));
    this.counterIds = [];
    for (let gp of this.counterGroup) {
      for (let counter of gp.counters) {
        counter["showEnable"] = false;
      }
    }
  }




  addAllCounterIds(counterGrp, value, counterKPI?) {
    this.countersDisplay = [];
    counterGrp.counterEnabled = [];
    if (counterKPI == 'counters') {
      if (counterGrp.counterList) {
        for (let counters of counterGrp.counterList) {
          counters["showEnable"] = value;
          this.addCounterIds(counters,value, counterGrp, 'counters');
        }
      }
    } else {
      if (counterGrp.kpis) {
        for (let kpi of counterGrp.kpis) {
          kpi["showEnable"] = value;
          this.addCounterIds(kpi,value, counterGrp, 'kpi');
        
        }
      }
    }



  }

  addAllKPIs(counterGrp, value) {
    this.countersDisplay = [];
    counterGrp.kpiEnabled = [];
   
      for (let kpi of counterGrp.kpis) {
        kpi["showEnable"] = value;
        this.addCounterIds(kpi, value, counterGrp);
      }
    

  }


  addAllCounterGroups(value) {
    if (value) {
      this.counterGroupsDisplay = [];
      let request = {
        "counterGroups": [

        ]
      };
      let arr = [];
      for (let groups of this.deviceTypeModel.controlgroup) {

        groups["showEnable"] = true;
        groups["search"] = "";
        if (!groups.counterList || groups.counterList.length <= 0) {
          arr.push({ "counterGroupId": groups.counterGroupId });
        }
        //for(let groups of this.counterGroupsDisplay){
      }
      request.counterGroups = arr;
      if (arr && arr.length <= 0) {
        this.getreportService.getCounterIDs(request).subscribe(data => {
          this.deviceTypeModel.controlgroup = data;
          for (let controlgroup of this.deviceTypeModel.controlgroup) {
            $.extend(controlgroup, { showEnable: true });
          }
        }, (err) => {
          console.log(err);
        });
      }
      // this.addCountersIntoGroup(groups, true);

    } else {
      //this.clearAllData();
      for (let groups of this.deviceTypeModel.controlgroup) {
        groups["showEnable"] = false;
      }
    }
  }



  addJSONParsedModel(device, $event?) {
    this.deviceTypeModel = {};
    this.clearAllData();
    let request = {};
    // if (device == 'all') {
    //   request = {
    //     "allNodeFlag": true,
    if (device != 'all') {

      this.deviceTypeModel = JSON.parse(JSON.stringify(device));
    }
    else
    { this.deviceTypeModel.elementUserLabel = "All Nodes"; }

    request["deviceType"] = this.element;

    this.getreportService.getCounterGroups(request).subscribe(data => {
      if (data) {
        this.deviceTypeModel.controlgroup = JSON.parse(JSON.stringify(data));
      }

      for (let controlgroup of this.deviceTypeModel.controlgroup) {
        $.extend(controlgroup, { showEnable: false, showAll: false, typeShown: "Counter", showEnableProps: false, showAllProps: false, disabled: false ,showAllKPI:false});

      }
      // setTimeout(() => {
      //   this.showCustomScrollbar('virtual-scroll');
      // }, 0)

    }, (err) => {
      console.log(err);
    });
    request["deviceType"] = this.element;
    let request1 = {
      "deviceType": this.element
    };
    // this.getreportService.getCounterGroupsKPI(request1).subscribe((data) => {
    //   if (data) {
    //     this.deviceTypeModel.controlgroupKPI = JSON.parse(JSON.stringify(data));
    //   }

    //   for (let controlgroup of this.deviceTypeModel.controlgroupKPI) {
    //     $.extend(controlgroup, { showEnable: false, showAllProps: false, typeShown: "KPI", disabled: false });
    //   }
    //   //this.counterGroupKPIPopUp = this.deviceTypeModel.controlgroupKPI;
    //   this.showCustomScrollbar('ul.dropdown-overflow');
    // }, (err) => {
    //   console.log(err);
    // })

    // this.controlgroup = "";
    // $('div#counterGroup').children('tags-input').on('click', (e) => {
    //   this.showDropdown(e);
    // })

    if ($event) {
      this.hideParentDropdown($event);
    }

    if (this.element != 'DSR') {
      this.level = "Node";
    }



  }

  clearAllData() {
    this.counterIds = [];
    this.counterGroupMap.clear();
    this.counterGroupCounters = [];
    this.counterGroupsDisplay = [];
    this.countersDisplay = [];
    this.subElementAdded = { displayName: "" };
    this.detailedResponseArray = [];
    this.subElement = [];
    this.countersInCG = [];
    this.kpisInCG = [];
    this.response = [];
    this.tableResponse = {};
    this.kpiListChecked = [];
    this.kpiResponse = [];
    this.kpiTableResponse = { data: [], headers: [] };
    this.kpiList.forEach((elem) => {
      elem.addToReport = false;
    })
    this.level = "";
    this.counterGroupsEnabled = { kpi: [], counters: [] };
    this.tabSelected = "";
  }


  addCountersIntoGroup(counterGroup, value, $event?) {
    this.counterLoading = true;
    if (value) {
      this.counterGroupsDisplay.push(counterGroup);
    }

    let request = {
      "counterGroups": [

      ]
    };
    let arr = [];

    arr.push({ "counterGroupId": counterGroup.counterGroupId });

    if (value) {
      request.counterGroups = arr;
      if (!counterGroup.counterList || counterGroup.counterList.length <= 0) {
        this.getreportService.getCounterIDs(request).subscribe(data => {
          if (data) {
            for (let cg of data) {
              if (counterGroup.counterGroupId == cg.counterGroupId) {
                counterGroup.counterList = cg.counterList;
                counterGroup.properties = cg.properties;
                counterGroup.kpis = cg.kpis;
              }
            }

            let i = 0;
            for (let counter of counterGroup.counterList) {
              counter = Object.assign(counter, { showEnable: false }, { disabled: false });
            }

            for (let kpi of counterGroup.kpis) {
              kpi = Object.assign(kpi, { showEnable: false }, { disabled: false });
            }

            for (let property of counterGroup.properties) {

              $.extend(property, { showEnable: false }, { id: i });
              // if (null != property.propertyValues) {
              //   property.propertyValues = property.propertyValues.split(",");
              // }
              i++;
           }
            this.counterLoading = false;
            this.counterGroupPopUp = counterGroup;

          }
        }, (err) => {
          console.log(err);
        });
      } else {
        this.counterGroupPopUp = counterGroup;
        if (this.properties && this.properties.length == this.propertiesAllowed) {
          for (let property of counterGroup.properties) {
            if ((this.newReportForm.controls["ReportType"].value).type == 'Graph' || (this.newReportForm.controls["ReportType"].value).type == 'TopN') {
              $.extend(property, { disabled: true });
            }
          }
        }
      }
    }
  }


  addCountersIntoGroup2(counterGroup, value) {
    let request = {
      "counterGroups": [

      ]
    };
    if (value) {
      request.counterGroups.push({ "counterGroupId": counterGroup.counterGroupId });
      this.getreportService.getCounterIDs(request).subscribe(data => {
        if (data) {
          counterGroup.counterList = data.counterList;
        }
      }, (err) => {
        console.log(err);
      });
    }
  }





  selectedReportType(reportSubType, reportType) {
    this.newReportForm.controls["ReportType"].setValue({
      type: reportType,
      subType: reportSubType.name
    });



  }

  updateSortState(value) {
    this.sortState = value;
  }

  setFormControlValues(fieldvalue, type) {
    this.newReportForm.controls[type].setValue(fieldvalue);
  }

  selectDeviceType(device, $event?) {
    //this.nodes = device;
    // this.device =  device;
    this.deviceTypeModel.elementUserLabel = "";
    this.nodes = [];
    let request = {

      "deviceType": device


    };
    this.element = device;
    if (this.element != 'DSR') {
      this.getreportService.getNodesFromNodeType(request).subscribe(data => {
        this.nodes = data;
      }, (err) => {
        console.log(err);
      });
      this.levels = ["Subelement", "Node"];

    } else {
      this.addJSONParsedModel("all");
      this.getreportService.getLevelsByDeviceType(request).subscribe((data) => {
        this.levels = data;
      }, (err) => {
        console.log(err);
      })
    }

    this.clearAllData();
    if ($event)
      this.hideParentDropdown($event);

  }


  hideParentDropdown(event) {
    $(event.currentTarget).parents('div.drop-list').removeClass('show').addClass('hide');

  }
  clearArrays(id) {
    this.detailedResponseArray = [];
    $('#' + id).click();
  }




  jsonParsedModel(model) {
    if (typeof model == "string" && model == "ALL") {
      this.subElementAdded.displayName = "All SubElements";
    } else {
      this.subElementAdded = JSON.parse(JSON.stringify(model));
    }

  }

  removeClass(index, report) {
    this.clickedIndex = index;
    report.showTab = true;
    $('div.reports:not([id=report' + index + '])').toggleClass('active');
    $('div.reports:not([id=report' + index + '])').css('display', 'none');
    $('div.reports[id=report' + index + ']').css('display', 'block');
  }


  saveReport() {
    let request = this.getreportService.getColumnReportRequest();
    request["userName"] = this.localStorageService.get("userName");
    this.getreportService.saveUserReport(request).subscribe((data) => {
      let menu: any = this.localStorageService.get('menu');
      let reportId = data.userTemplateId;
      this.menuService.setMenu(data);
      this.menuService.setMenuSubject("Menu updated");
      this.router.navigate(['/report/' + reportId + '/userReport']);
    }, (err) => {
      console.log(err);
    });
  }



  exportReport(exportType) {
    let request = {};
    request["userName"] = this.localStorageService.get('userName');
    request["jsonString"] = this.getreportService.getColumnReportRequest()["jsonString"];
    request["fileType"] = exportType;
    this.getreportService.exportUserReport(request).subscribe((data) => {
      if (null != data && data != undefined) {
        var l = document.createElement('a');
        l.download = 'chart';
        l.href = data['downloadURL'];
        if (null != data['downloadURL'] && data['downloadURL'] != undefined) {
          window.open(l.href);
          document.body.appendChild(l);
          document.body.removeChild(l);
        }
      }
    }, (err) => {
      console.log(err);
    })
  }


  checkEnableDisableCounterGroup(group, type) {
    let defaultValue = true;
    let hasGroupId = false;
    let hasGroupIdinCounter = false;

    if ((this.tabSelected == "kpi" && type == "counters") || (this.tabSelected == "counters" && type == "kpi")) {
      return { 'counter-disabled': false };
    }

    this.counterGroupsEnabled[type].forEach((elem, i) => {
      defaultValue = false;
      if (group.counterGroupId == elem.counterGroupId) {
        hasGroupId = true;
      }
    });
    if (defaultValue || hasGroupId) {
      return { 'counter-disabled': false };
    }
    else {
      return { 'counter-disabled': true };
    }

  }

  counterGroupEnabled(elem) {
    if ($(elem) && $(elem).length > 0) {
      return true;
    } else {
      return false;
    }
  }


  checkKPIorCounter(element, counterGroup, option?) {
    if (option == 'counters') {
      this.addCounterIds(element, element.showEnable, counterGroup, undefined);
    } else if (element.kpiType == 'derived') {
      this.addCounterIds(element, element.showEnable, counterGroup, 'kpi');
    } else {
      this.addKPIs(element, element.showEnable, counterGroup);
    }
  }

  setReportDataType(type) {
    this.reportDataType = type;
  }

  addProperties(propertyName, value, filtervalue, group?) {

      if (this.properties || this.properties.length == 0) {
        this.clearResponse();
      }

      if (propertyName && this.properties.indexOf(propertyName) < 0 && value) {
        this.properties.push(propertyName);
        if (filtervalue && filtervalue != 'None') {
          this.requestFilterMap.set(propertyName, filtervalue);
        }

      } else if (propertyName && this.properties.indexOf(propertyName) >= 0 && !value) {
        this.properties.splice(this.properties.indexOf(propertyName), 1);

        if (this.requestFilterMap.get(propertyName)) {
          this.requestFilterMap.delete(propertyName);
        }

      }
       
  }

  addAllProperties(group, value) {
    for (let props of group.properties) {
      this.addProperties(props.propertyName, value, null);
      props["showEnable"] = value;
    }

  }
  getCounterGroupArray() {
    let counterGrpArry = [];
    let counterGrp = {};
    let counterArray = [];
    let properties = [];
    let kpiArray = [];
    for (let group of this.deviceTypeModel.controlgroup) {
      counterArray = [];
      kpiArray = [];
      properties=[];
      counterGrp = Object.assign({}, ...group);
      if (group.counterList) {
        group.counterList.forEach((counter) => {
          let ctr = {};
          if (counter.showEnable) {
            for (let key in counter) {
              if (key != 'showEnable' && key != 'disabled' ) {
                ctr[key] = counter[key];
              }
            }
              counterArray.push(ctr);
          }

        })

        counterGrp["counterList"] = counterArray;
      }
      if (group.properties) {
        group.properties.forEach((prop) => {
          let property = {};
          if (prop.showEnable) {
            for (let key in prop) {
              if (key != 'showEnable' && key != 'id') {
                property[key] = prop[key];
              }
            }
             properties.push(property);
          }
        })
        counterGrp["properties"] = properties;
      }
         if (group.kpis) {
       group.kpis.forEach((kpi) => {
          let kpiObj = {};
          if (kpi.showEnable) {
            for (let key in kpi) {
              if (key != 'showEnable' && key != 'disabled') {
                kpiObj[key] = kpi[key];
              }
            }
             kpiArray.push(kpiObj);
          }
        })
        counterGrp["kpis"] = kpiArray;
      }
       let cgrp = {};

    for (let key in counterGrp) {
      if (key != 'showEnable' && key != 'showAll' && key != 'typeShown' && key != 'showEnableProps' && key != 'showAllProps' && key != 'disabled' && key !='showAllKPI' && key!='counterEnabled') {
        cgrp[key] = counterGrp[key];
      }
    }


    if ((properties.length > 0) || (counterArray && counterArray.length > 0)) {
      counterGrpArry.push(cgrp);
    }
    }
   
   
    // for (let group1 of this.deviceTypeModel.controlgroupKPI) {
    //    counterArray = [];
    //   kpiArray = [];
    //   properties=[];
    //   counterGrp = Object.assign({}, ...group1);
    //   if (group1.kpis) {
    //     kpiArray = group1.kpis.filter((kpi) => {
    //       let kpiObj = {};
    //       if (kpi.showEnable) {
    //         for (let key in kpi) {
    //           if (key != 'showEnable' && key != 'disabled') {
    //             kpiObj[key] = kpi[key];
    //           }
    //         }
    //         return kpiObj;
    //       }
    //     })
    //     counterGrp["kpis"] = kpiArray;
    //   }
    //   properties = [];
    //   if (group1.properties) {
    //     properties = group1.properties.filter((prop) => {
    //       let property = {};
    //       if (prop.showEnable) {
    //         for (let key in prop) {
    //           if (key != 'showEnable' && key != 'showAll' && key != 'typeShown' && key != 'showEnableProps' && key != 'showAllProps' && key != 'disabled') {
    //             property[key] = prop[key];
    //           }
    //         }
    //         return property;
    //       }
    //     })
    //     if (properties.length > 0)
    //       counterGrp["properties"]=(properties);
    //   }


    //   let cgrp = {};

    //   for (let key in counterGrp) {
    //     if (key != 'showEnable' && key != 'showAll' && key != 'typeShown' && key != 'showEnableProps' && key != 'showAllProps' && key != 'disabled') {
    //       cgrp[key] = counterGrp[key];
    //     }
    //   }


    //   if ((properties.length > 0) || (kpiArray && kpiArray.length > 0)) {
    //     counterGrpArry.push(cgrp);
    //   }
    // }
    console.log(counterGrpArry);
  }

  disableCounters() {
    if ((this.newReportForm.controls["ReportType"].value).type == 'Graph') {
      if (this.counterIds && this.counterIds.length == 5) {
        if (this.scrollLists && this.scrollLists.length > 0) {
          for (let counter of this.scrollLists) {
            $('#counter-' + counter.counterId + ':not(:checked)').attr("disabled", "true");
          }
        }
        setTimeout(() => {
          $('a.counter-groups:not(a.has-enabled-counters)').addClass('disabled');
        }, 0)
      }
    }
  }
  getEnabledCounter(cg, key) {
    if (cg[key]) {
      for (let counters of cg[key]) {
        if (counters["showEnable"]) {
          return true;

        }
      }
    }
    return false;

  }
}