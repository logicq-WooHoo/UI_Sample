import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response, RequestMethod, Request } from '@angular/http';
import { Observable, Subscription } from 'rxjs';
import { LocalStorageService } from 'angular-2-local-storage';
import { AppConfig } from '../../../../configurations/app.config';
import { GetJSONService } from '../../getJSON.service';
import { ConfigService } from '../../config/config.service';
import { DataLoadSpinner } from '../../dataLoadSpinner.service';
import { GetreportService } from '../../http/report/getreport.service';
@Injectable()
export class ChartTableService {
    constructor(private getreportService: GetreportService, private configService: ConfigService) { }
    refreshInterval = this.configService.getConfiguration().refreshInterval;
    timerSubscription: Subscription;
    report: any;
    refreshData() {
        let request = this.getReport();
        if (request) {
            request.jsonString["intervals"] = "last 5 minutes";
            request.refreshedData = true;
            this.getreportService.getSpecificReport(request).subscribe(data => {
                if (data && data.response && data.response[0] && data.response[0].events && data.response[0].events.length > 0) {
                    return data;
                }
            });
        }

    }


    subscribeToData() {
        this.timerSubscription = Observable.timer(this.refreshInterval).first().subscribe(() => this.refreshData());
    }

    setReport(report) {
        this.report = report;
    }

    getReport() {
        return this.report;
    }

}