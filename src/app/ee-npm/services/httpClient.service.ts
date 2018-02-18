
import { Http, Request, RequestOptionsArgs, Response, XHRBackend, RequestOptions, ConnectionBackend, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { Observable } from 'rxjs/Rx';
import { DataLoadSpinner } from './dataLoadSpinner.service';
import { LocalStorageService } from 'angular-2-local-storage';

// import { CommonServiceService } from '../services/common/common-service.service';


export class HttpClientService extends Http {

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private _spinner: DataLoadSpinner,
        private localStorageService: LocalStorageService) {

        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.request(url, options));
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {

        return this.intercept(super.get(url, this.getRequestOptionArgs(options)));
    }


    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {

        // this._spinner.show();

        return this.intercept(super.post(url, body, this.getRequestOptionArgs(options)));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(url, body, this.getRequestOptionArgs(options)));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(url, options));
    }

    options(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.options(url, this.getRequestOptionArgs(options)));
    }

    getRequestOptionArgs(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }

        // let authtoken :any = this.commonService.getToken();
        let authtoken: any = this.localStorageService.get('auth-token');

        options.headers.append('AUTH-TOKEN', authtoken);


        return options;
    }

    intercept(observable: Observable<Response>): Observable<Response> {

        return observable.catch((err, source) => {
            // if (err.status  == 401 && !_.endsWith(err.url, 'api/auth/login')) {
            //     this._router.navigate(['/login']);
            //     return Observable.empty();
            // } else {
            //     return Observable.throw(err);
            // }
            // if (err.status  == 400)
            // {
            //   this._spinner.hide();
            // }

            if (err.status != 200) {
                this._spinner.removeSpinnerButton();
                // if (err._body.type == "error") {
                //     this._spinner.showErrorMessage("");
                //     return observable;
                // }else if(err.statusText){
                //     this._spinner.showErrorMessage(err.statusText);
                //     return observable;
                // } else {
                //     this._spinner.showErrorMessage(JSON.parse(err._body));
                //     return observable;
                // }
                
            }
        return  Observable.throw(err);
        }).finally(() => {
            // if (err.status  == 401 && !_.endsWith(err.url, 'api/auth/login')) {
            //     this._router.navigate(['/login']);
            //     return Observable.empty();
            // } else {
            //     return Observable.throw(err);
            // }
            this._spinner.hide();
            this._spinner.removeSpinnerButton();
        })
    }

}

// bootstrap(MyApp, [
//   HTTP_PROVIDERS,
//     ROUTER_PROVIDERS,
//     provide(LocationStrategy, { useClass: HashLocationStrategy }),
//     provide(Http, {
//         useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions, router: Router) => new HttpInterceptor(xhrBackend, requestOptions, router),
//         deps: [XHRBackend, RequestOptions, Router]
//     })
// ])
// .catch(err => console.error(err));
