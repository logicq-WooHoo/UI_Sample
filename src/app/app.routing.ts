import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EENpmComponent } from './ee-npm/ee-npm.component';
import { CreateReportComponent } from './ee-npm/create-report/create-report.component';
import { SelectUserComponent } from './select-user/select-user.component';
import { LoginComponent } from './login/login.component';
import { MibSupportComponent } from './ee-npm/mib-support/mib-support.component';
import { DashboardComponent } from  './ee-npm/dashboard/dashboard.component';
import { KpiCreationComponent } from  './ee-npm/kpi-creation/kpi-creation.component';
import { DynamicCounterComponent } from  './ee-npm/dynamic-counter/dynamic-counter.component';
import {ReportComponent} from './ee-npm/report/report.component';
import {SchedularComponent} from './ee-npm/schedular/schedular.component';
import {ReportDataResolver} from './ee-npm/resolvers/report/report-data.resolver';
import {UserComponent} from './ee-npm/user/user.component';
import { SubdashboardsComponent } from './ee-npm/subdashboards/subdashboards.component';

export const appRoutes: Routes = [

  { path: '', pathMatch: 'full', component: LoginComponent },
  {
    path: '',
    component: EENpmComponent,
    children: [
      { path: 'report/createReport', component: CreateReportComponent },
      { path: 'editReport/:templateId', component: CreateReportComponent ,resolve:{configuration : ReportDataResolver}},
      { path: 'mibSupport', component: MibSupportComponent },
      { path: 'dashboard/:dashboardId/subdashboard/:subdashboardId' , component : DashboardComponent},
      { path: 'kpiCreation' , component : KpiCreationComponent},
       { path: 'kpiCreation/:id' , component : KpiCreationComponent},
       { path: 'dashboard/:reportId/:type/:dashboardId' , component : ReportComponent},
       { path: 'report/:reportId/:type' , component : ReportComponent},
       { path: 'user' , component : UserComponent},
        { path: 'dynamicCounterAddition' , component : DynamicCounterComponent},
        { path:  'subdashboards/:dashboardId' , component : SubdashboardsComponent},
    ]

  }

];


export const appRoutingProviders: any[] = [
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });