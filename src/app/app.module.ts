import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule, BrowserXhr, Http, Request, RequestOptionsArgs, Response, XHRBackend, RequestOptions, ConnectionBackend, Headers } from '@angular/http';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { EENpmModule } from './ee-npm/ee-npm.module';
import { APP_BASE_HREF } from '@angular/common';
import { routing, appRoutingProviders } from './app.routing';
import { SelectUserComponent } from './select-user/select-user.component';
import { HttpClientService } from './ee-npm/services/httpClient.service';
import { DataLoadSpinner } from './ee-npm/services/dataLoadSpinner.service';
import { GetJSONService } from './ee-npm/services/getJSON.service';
import { LocalStorageService, LocalStorageModule } from 'angular-2-local-storage';
import { LineChartComponent } from './ee-npm/charts/line-chart/line-chart.component';
import { InlineChartComponent } from './ee-npm/charts/inline-chart/inline-chart.component';
import { ConfigService } from './ee-npm/services/config/config.service';
import { environment } from '../environments/environment.prod';
import { MenuService } from './ee-npm/services/menu/menu.service';
import { LoginService } from './ee-npm/services/http/login/login.service';
import { SharedModule } from './ee-npm/shared/shared.module';
import {ReportDataResolver} from './ee-npm/resolvers/report/report-data.resolver';
export function HttpServiceFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions, localStorageService: LocalStorageService, spinner: DataLoadSpinner) {
  return new HttpClientService(xhrBackend, requestOptions, spinner, localStorageService);
}
export function ConfigLoader(configService: ConfigService) {
  if (environment.production) {
    return () => configService.load(environment.configProdFile);
  } else {
    return () => configService.load(environment.configDevFile);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SelectUserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    EENpmModule,
    routing,
    LocalStorageModule.withConfig({
      prefix: 'ee_npm',
      storageType: 'localStorage'
    }),
    ReactiveFormsModule,
    SharedModule
  ],
  providers: [ConfigService, {provide: APP_INITIALIZER,useFactory: ConfigLoader,deps: [ConfigService],multi: true}, { provide: APP_BASE_HREF, useValue: '/ee-npm/' }, appRoutingProviders, DataLoadSpinner, LocalStorageService,ReportDataResolver, {
      provide: Http,
      useFactory: HttpServiceFactory,
      deps: [XHRBackend, RequestOptions, LocalStorageService, DataLoadSpinner]
    }, GetJSONService,MenuService,LoginService],
  bootstrap: [AppComponent],
  entryComponents: [LineChartComponent,InlineChartComponent]
})
export class AppModule {

}
