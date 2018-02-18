import { Injectable, Inject} from '@angular/core';
import { Http,Headers,RequestOptions,Response,RequestMethod,Request} from '@angular/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'angular-2-local-storage';
import { AppConfig } from '../../../../configurations/app.config';
import { GetJSONService }  from '../../getJSON.service';
import { ConfigService }  from '../../config/config.service';
import { DataLoadSpinner }  from '../../dataLoadSpinner.service';
@Injectable()
export class DynamicCounterService {
      baseUrl = this.configService.getConfiguration().baseUrl;
    druidUrl = this.configService.getConfiguration().druidBaseUrl;
    httpRestCall = this.configService.getConfiguration().httpRestCall;
    constructor(private http :Http , private config :AppConfig,private configService : ConfigService,private getJSONService:GetJSONService,private dataLoadSpinner : DataLoadSpinner ){}
    addCounter(request){

    }
}