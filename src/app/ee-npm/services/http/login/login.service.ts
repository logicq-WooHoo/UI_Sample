import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response, RequestMethod, Request } from '@angular/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'angular-2-local-storage';
import { AppConfig } from '../../../../configurations/app.config';
import { GetJSONService } from '../../getJSON.service';
import { ConfigService } from '../../config/config.service';
import { DataLoadSpinner } from '../../dataLoadSpinner.service';

@Injectable()
export class LoginService {
    baseUrl = this.configService.getConfiguration().baseUrl;
    druidUrl = this.configService.getConfiguration().druidBaseUrl;
    httpRestCall = this.configService.getConfiguration().httpRestCall;
    constructor(private http: Http, private config: AppConfig, private configService: ConfigService, private getJSONService: GetJSONService, private dataLoadSpinner: DataLoadSpinner) { }
    login(request) {
        let postheaders = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
        let loginUrl = this.baseUrl + this.config.login;
        postheaders.append('userName', request.userName);
        postheaders.append('password', request.password);
        let options = new RequestOptions({ headers: postheaders });
        if (this.httpRestCall) {
            this.dataLoadSpinner.show();
            return this.http.post(loginUrl, request, options).map(res => res.json()).catch(err => Observable.throw(err));
        } else {
            return this.getJSONService.getJSON(this.config.LoginResponseJSON).map(res => res.json());
        }
    }

}