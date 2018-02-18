import { Injectable } from '@angular/core';
import { Http,Headers,RequestOptions,Response,RequestMethod,Request} from '@angular/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../configurations/app.config';
import { ConfigService }  from '../../config/config.service';
import { DataLoadSpinner }  from '../../dataLoadSpinner.service';

@Injectable()
export class SchedularService {

  constructor(private http :Http , private config :AppConfig,private configService : ConfigService,private dataLoadSpinner : DataLoadSpinner ) { }

  baseUrl = this.configService.getConfiguration().baseUrl;
  httpRestCall = this.configService.getConfiguration().httpRestCall;
  
  scheduleReport(request)
  {
    let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
    let options = new RequestOptions({ headers: postheaders });
    let createScheduleTaskUrl = this.baseUrl + this.config.scheduleTaskURL;
    if(this.httpRestCall){
      return this.http.post(createScheduleTaskUrl ,request ,options).map(res => res).catch(err => Observable.throw(err));
     } 
  }

  getScheduledReports(username)
  {
    let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
    let options = new RequestOptions({ headers: postheaders });
    let taskListURL = this.baseUrl + this.config.scheduleTasklistURL;
    if(this.httpRestCall){
      return this.http.get(taskListURL+'?username='+username,options).map(res => res.json()).catch(err => Observable.throw(err));
     }else{
        return this.http.get(this.config.getScheduledReportJSON,options).map(res => res.json());
     }
  }

  deleteTask(taskId)
  {
    let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
    let options = new RequestOptions({ headers: postheaders });
    let deletetaskURL = this.baseUrl + this.config.deleteScheduledtaskURL + '/'+taskId;
    if(this.httpRestCall){
      return this.http.delete(deletetaskURL).map(res => res).catch(err => Observable.throw(err));
     } 
  }

  updateScheduleTask(request)
  {
    let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
    let options = new RequestOptions({ headers: postheaders });
    let updateScheduledtaskURL = this.baseUrl + this.config.updateScheduledtaskURL;
    if(this.httpRestCall){
         return this.http.post(updateScheduledtaskURL ,request ,options).map(res => res).catch(err => Observable.throw(err));
     } 
  }
}
