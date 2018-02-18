import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, BrowserXhr, Http, Request, RequestOptionsArgs, Response, XHRBackend, RequestOptions, ConnectionBackend, Headers } from '@angular/http';
import { EENpmComponent } from './ee-npm.component';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';

import { UploadMibComponent } from './upload-mib/upload-mib.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { MibSupportComponent } from './mib-support/mib-support.component';
import { routing, appRoutingProviders } from '../app.routing';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggedUserComponent } from './logged-user/logged-user.component';
import { LocalStorageModule } from 'angular-2-local-storage';
import { ChartsModule } from './charts/charts.module';
import {ChartTableModule } from './chart-table/chart-table.module';
import { GetreportService } from './services/http/report/getreport.service';
import { CommonParsingService } from './services/common/common.parsing.service';
import { CommonHighchartsOptionsService } from './services/common/common.highcharts.options.service';
import { SubdashboardsService } from './services/http/subdashboards/subdashboards.service';

import { TooltipModule , PaginationModule } from 'ngx-bootstrap';
import { AppConfig } from '../configurations/app.config';
import { CommonGetterSetterService } from './services/common/common.getterSetter.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { KpiCreationComponent } from './kpi-creation/kpi-creation.component';
import { KpiService } from './services/http/kpi/kpi.service';
import { ReportComponent } from './report/report.component';
import { SchedularComponent } from './schedular/schedular.component';
import { UserComponent } from './user/user.component';
import { DynamicCounterComponent } from './dynamic-counter/dynamic-counter.component';
import { VirtualScrollModule } from 'angular2-virtual-scroll';
import { SubdashboardsComponent } from './subdashboards/subdashboards.component';

@NgModule({
  declarations: [
    EENpmComponent,
    MenuComponent,
    HeaderComponent,

    UploadMibComponent,
    CreateReportComponent,
    MibSupportComponent,
    LoggedUserComponent,
    DashboardComponent,
    KpiCreationComponent,
    ReportComponent,
    SchedularComponent,
    UserComponent,
    DynamicCounterComponent,
    SubdashboardsComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    SharedModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LocalStorageModule.withConfig({
      prefix: 'ee-npm-app',
      storageType: 'localStorage'
    }),
    ChartsModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    ChartTableModule,
    VirtualScrollModule
  ],
  exports: [
    EENpmComponent,
    MenuComponent,
    HeaderComponent,
    LoggedUserComponent],

  providers: [appRoutingProviders, GetreportService, CommonParsingService,  CommonHighchartsOptionsService, AppConfig,
  CommonGetterSetterService,KpiService ,SubdashboardsService
  ]
  
})
export class EENpmModule { }
