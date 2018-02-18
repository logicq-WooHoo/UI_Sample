import { Injectable, Inject} from '@angular/core';
import { Http,Headers,RequestOptions,Response,RequestMethod,Request} from '@angular/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'angular-2-local-storage';
import 'rxjs/add/operator/map'
import { AppConfig } from '../../../../configurations/app.config';
import { GetJSONService }  from '../../getJSON.service';
import { ConfigService }  from '../../config/config.service';
import { DataLoadSpinner }  from '../../dataLoadSpinner.service';
@Injectable()
export class GetreportService {

    public columnReportRequest : any;
    baseUrl = this.configService.getConfiguration().baseUrl;
    druidUrl = this.configService.getConfiguration().druidBaseUrl;
    httpRestCall = this.configService.getConfiguration().httpRestCall;
 constructor(private http :Http , private config :AppConfig , private getJSONService:GetJSONService, private configService : ConfigService,private dataLoadSpinner : DataLoadSpinner){};

    getDriudData(request:any){
        let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     let urlForDruid =this.druidUrl + "druid/v2/?pretty";
      if(this.httpRestCall){
     return this.http.post(urlForDruid ,request ,options).map(res => res.json()).catch(err => Observable.throw(err));
    } else{
            return this.getJSONService.getJSON(this.config.getDruidResponseJSON).map(res => res.json());
     }
    }

    getDevices(){
    let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     let url = this.baseUrl + this.config.getElementsDevice ;
     if(this.httpRestCall){
         return this.http.get(url  ,options).map(res => res.json()).catch(err => Observable.throw(err));
     }
     else{
            return this.getJSONService.getJSON(this.config.getElementsDeviceJSON).map(res => res.json());
     }
    
    }

    getCounterGroups(request){
    let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     //let url =  this.baseUrl + this.config.getCounterGroups ;
     let url =  this.baseUrl + this.config.getCounterGroupsByDeviceType;
     if(this.httpRestCall){
        return this.http.post(url  ,request ,options).map(res => res.json()).catch(err => Observable.throw(err));
     }else{
            return this.getJSONService.getJSON(this.config.getCounterGroupsJSON).map(res => res.json());
     }
    }

    getCounterGroupsKPI(request){
          let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     let url =  this.baseUrl + this.config.getCounterGroupsKPI ;
     if(this.httpRestCall){
        return this.http.post(url  ,request ,options).map(res => res.json()).catch(err => Observable.throw(err));
     }else{
            return this.getJSONService.getJSON(this.config.getCounterGroupsKPIJSON).map(res => res.json());
     }
    }

    getCounterIDs(request){
    let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     let url = this.baseUrl + this.config.getCounterIds ; 
      if(this.httpRestCall){
     return this.http.post(url  ,request ,options).map(res => res.json()).catch(err => Observable.throw(err));
     }else{
            return this.getJSONService.getJSON(this.config.getCounterIDsJSON).map(res => res.json());
     }
    }

    getNodesFromNodeType(request){
    let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     let url = this.baseUrl + this.config.getNodeFromDevice ; 
      if(this.httpRestCall){
     return this.http.post(url  ,request ,options).map(res => res.json()).catch(err => Observable.throw(err));
     }else{
            return this.getJSONService.getJSON(this.config.getNodesFromNodeTypeJSON).map(res => res.json());
     }
    }

    getSubElementsFromNodes(request){
    let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     let url = this.baseUrl + this.config.getSubElementsFromNodes ; 
      if(this.httpRestCall){
     return this.http.post(url  ,request ,options).map(res => res.json()).catch(err => Observable.throw(err));
     }else{
            return this.getJSONService.getJSON(this.config.getSubElementsFromNodesJSON).map(res => res.json());
     }
    }

    getSpecificReport(request){
        let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     
     let url =  this.baseUrl + this.config.getspecificreport ;
    // url = "http://172.31.73.127:8080/eenpm/"+ this.config.getspecificreport ;
     if(this.httpRestCall){
         if(!request.refreshedData)
         this.dataLoadSpinner.show();
        return this.http.post(url  ,request ,options).map(res => res.json()).catch(err => Observable.throw(err));
     }else{
            return this.getJSONService.getJSON(this.config.getSpecificReportJSON).map(res => res.json());
     }
    }

    getSpecificReportDetailed(request){
        let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     let url =  this.baseUrl + this.config.getspecificreport ;
     if(this.httpRestCall){
         if(!request.refreshedData)
         this.dataLoadSpinner.show();
        return this.http.post(url  ,request ,options).map(res => res.json()).catch(err => Observable.throw(err));
     }else{
            return this.getJSONService.getJSON(this.config.getSpecificReportDetailedJSON).map(res => res.json());
     }
    }

    setColumnReportRequest(columnReportRequest){
        this.columnReportRequest =columnReportRequest;
    }

    getColumnReportRequest(){
        return this.columnReportRequest;
    }

    getUserReport(request){
        let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     let url = this.baseUrl + this.config.getUserReport ; 
      if(this.httpRestCall){
     this.dataLoadSpinner.show();
     return this.http.post(url  ,request ,options).map(res => res.json()).catch(err => Observable.throw(err));
     }else{
            if(request.isDashboardReport)
            {
                return this.getJSONService.getJSON(this.config.getSpecificReportResponseForDashboardReportJSON).map(res => res.json());
            }
            else
             { return this.getJSONService.getJSON(this.config.getSpecificReportJSON).map(res => res.json()); }
     }
    }

    getLevelsByDeviceType(request){
       let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     let url = this.baseUrl + this.config.getLevelsByDeviceType ; 
      if(this.httpRestCall){
     return this.http.post(url  ,request ,options).map(res => res.json()).catch(err => Observable.throw(err));
     }else{
            return this.getJSONService.getJSON(this.config.getLevelsByDeviceTypeJSON).map(res => res.json());
     } 
    }


    saveUserReport(request){
        let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     let url = this.baseUrl + this.config.saveUserReport ; 
      if(this.httpRestCall){
          this.dataLoadSpinner.show();
     return this.http.post(url  ,request ,options).map(res => res.json()).catch(err => Observable.throw(err));
     }else{
            return this.getJSONService.getJSON(this.config.saveUserReportJSON).map(res => res.json());
     }
    }

    exportUserReport(request){
        let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     let url = this.baseUrl + this.config.exportUserReport ; 
      if(this.httpRestCall){
          this.dataLoadSpinner.show();
     return this.http.post(url  ,request ,options).map(res => res.json()).catch(err => Observable.throw(err));
     }else{
            return this.getJSONService.getJSON(this.config.saveUserReportJSON).map(res => res.json());
     }
    }



}