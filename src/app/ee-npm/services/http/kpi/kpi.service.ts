import { Injectable, Inject} from '@angular/core';
import { Http,Headers,RequestOptions,Response,RequestMethod,Request} from '@angular/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'angular-2-local-storage';
import { AppConfig } from '../../../../configurations/app.config';
import { GetJSONService }  from '../../getJSON.service';
import { ConfigService }  from '../../config/config.service';
import { DataLoadSpinner }  from '../../dataLoadSpinner.service';
@Injectable()
export class KpiService {
      baseUrl = this.configService.getConfiguration().baseUrl;
    druidUrl = this.configService.getConfiguration().druidBaseUrl;
    httpRestCall = this.configService.getConfiguration().httpRestCall;
    constructor(private http :Http , private config :AppConfig,private configService : ConfigService,private getJSONService:GetJSONService,private dataLoadSpinner : DataLoadSpinner ){}
    createKPI(request:any){
         let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     let kpiUrl = this.baseUrl + this.config.createKpi;
    // kpiUrl = "http://172.31.73.94:8080/eenpm" + this.config.createKpi;
      if(this.httpRestCall){
     return this.http.post(kpiUrl ,request ,options).map(res => res).catch(err => Observable.throw(err));
    } else{
            return this.getJSONService.getJSON(this.config.getDruidResponseJSON).map(res => res.json());
     }
    }

    getKPIs(request:any){
         let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     let kpiUrl=this.baseUrl + this.config.getKPI;    
    // kpiUrl = "http://172.31.73.94:8080/eenpm/kpi/kpilist/";
      if(this.httpRestCall){
     return this.http.post(kpiUrl,request,options).map(res => res.json()).catch(err => Observable.throw(err));
    } else{
            return this.getJSONService.getJSON(this.config.getSuccessResponseJSON).map(res => res);
     }
    }

    updateKPI(request:any){
         let postheaders = new Headers({'Content-Type': 'application/json','Access-Control-Allow-Origin':'*'});
     let options = new RequestOptions({ headers: postheaders });
     let kpiUrl = this.baseUrl + this.config.updatekpi;
      // kpiUrl = "http://localhost:8090/eenpm11"+this.config.updatekpi;
    // kpiUrl = "http://172.31.73.94:8080/eenpm" + this.config.updatekpi;
      if(this.httpRestCall){
     return this.http.post(kpiUrl ,request ,options).map(res => res).catch(err => Observable.throw(err));
    } else{
            return this.getJSONService.getJSON(this.config.getDruidResponseJSON).map(res => res.json());
     }
    }

}