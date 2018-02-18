import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, RequestMethod, Request } from '@angular/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'angular-2-local-storage';
import { AppConfig } from '../../../../configurations/app.config';
import { GetJSONService } from '../../getJSON.service';
import { ConfigService } from '../../config/config.service';
import { DataLoadSpinner } from '../../dataLoadSpinner.service';

@Injectable()
export class SubdashboardsService {

  constructor(private http: Http, private config: AppConfig, private configService: ConfigService, private getJSONService: GetJSONService, private dataLoadSpinner: DataLoadSpinner) { }
  baseUrl = this.configService.getConfiguration().baseUrl;
  druidUrl = this.configService.getConfiguration().druidBaseUrl;
  httpRestCall = this.configService.getConfiguration().httpRestCall;

  getSubDashboardsForDashboard(request) {

    let postheaders = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    let options = new RequestOptions({ headers: postheaders });

    let url = this.baseUrl + this.config.getSubDashboardsForDashboard;
    if (this.httpRestCall) {
      if (!request.refreshedData)
        this.dataLoadSpinner.show();
      return this.http.post(url, request, options).map(res => res.json()).catch(err => Observable.throw(err));
    } else {
     return this.getJSONService.getJSON(this.config.getSubDashboardsJSON).map(res => res.json());
    }
  }

  getSpecificSubDashboard(request){
    
   let postheaders = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
   let options = new RequestOptions({ headers: postheaders });

   let url = this.baseUrl + this.config.getSpecificSubDashboard;
   if (this.httpRestCall) {
     if (!request.refreshedData)
       this.dataLoadSpinner.show();
     return this.http.post(url, request, options).map(res => res.json()).catch(err => Observable.throw(err));
   }else{
      return this.getJSONService.getJSON(this.config.getSpecificSubDashboardJSON).map(res => res.json()); 
   }
}
}
