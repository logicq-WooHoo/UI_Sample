import { Component, OnInit } from '@angular/core';
import { CommonParsingService } from '../services/common/common.parsing.service';
import { CommonFieldErrorUtilService } from '../services/common/common.field-error.util';
import { GetreportService } from '../services/http/report/getreport.service';
import { DataLoadSpinner } from '../services/dataLoadSpinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { CommonGetterSetterService } from '../services/common/common.getterSetter.service';
import { SubdashboardsService } from '../services/http/subdashboards/subdashboards.service';
import { MenuService } from '../services/menu/menu.service';
declare var require: any;
declare var $: any;
const resp = require("../../../assets/jsonResponse/getSpecficReportResponseNew.json");
const Highstock = require('highcharts/highstock.src');
const Highcharts = require('highcharts/highcharts.src');
require('highcharts/modules/exporting.js')(Highcharts);
require('highcharts/modules/offline-exporting.js')(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

})
export class DashboardComponent implements OnInit {
  reports: any;
  dashboardId: any;
  subDashboardId: any;
  dashboardDetails = { displayName: "", };
  menuToggled: any = false;
  breadcrumbs:any;
  constructor(private router: Router, private route: ActivatedRoute, private localStorageService: LocalStorageService, private reportService: GetreportService, private commonParsingService: CommonParsingService, private commonGetterSetterService: CommonGetterSetterService, private subdashboardsService: SubdashboardsService, private menuService: MenuService) { }

  ngOnInit() {
    this.route.url.subscribe(() => {
      if (this.router.url.match('dashboard')) {
        this.breadcrumbs = this.localStorageService.get('breadcrumbs');
       
        this.dashboardId = this.route.snapshot.params["dashboardId"];
        this.subDashboardId = this.route.snapshot.params["subdashboardId"];
        let request = {
          "userName": this.localStorageService.get('userName'),
          "dashboardId": this.route.snapshot.params["dashboardId"],
          "subDashboardId": this.route.snapshot.params["subdashboardId"]
        };
        this.subdashboardsService.getSpecificSubDashboard(request).subscribe((data) => {
          if (data) {
            this.dashboardDetails.displayName = data.name;
            let sublinks = this.breadcrumbs.sublinks[0];
            this.breadcrumbs.sublinks = [];
            this.breadcrumbs.sublinks.push(sublinks);
             this.breadcrumbs.sublinks.push({displayName:this.dashboardDetails.displayName,id:this.dashboardId,routing :'/dashboard/'+this.dashboardDetails["dashboardId"]+'/subdashboard/'+this.dashboardDetails["subDashboardId"]})
             this.localStorageService.set('breadcrumbs',this.breadcrumbs);
            this.reports = [];
            if (data["reports"]) {
              let report = { response: {} };
              data["reports"].forEach((reportData) => {
                let report = { response: {}, name: "" };
               // let view = data["view"];
               let view = "both";
                if (view == "both" || view == "table") {
                  report["tableResponse"] = this.commonParsingService.parseRestTableResponse(reportData);
                }
                if (view == "both" || view == "graph") {
                  report.response["type"] = reportData.reportConfiguration.configuration.subType;
                  report.response["graph"] = reportData;
                }
                report["name"] = reportData.reportConfiguration.configuration.name;
                this.reports.push(report);
              })
            }
            this.commonGetterSetterService.setSubDashboardReportConfigList(this.reports);
          }

        });
      }
    });

    this.menuService.getToggledValue().subscribe((data) => {
      this.menuToggled = data.value;
      // this._chart.redraw();
    });
  }

  editDashboard() {

  }


  getHtml() {
    let html = $('div.highcharts-container').html();

    console.log($('div.highcharts-container'));
    let html1 = "";
    $('div.highcharts-container').each((i, e) => {
      html1 = html1 + $(e).html();
    });

    let w = window.open();
    $(w.document.body).html(html1);
  }
}
