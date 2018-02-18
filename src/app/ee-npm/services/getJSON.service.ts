import { Injectable, Inject } from '@angular/core';
import { Http,Headers,RequestOptions,Response,RequestMethod,Request} from '@angular/http';
import { Observable } from 'rxjs';
@Injectable()
export class GetJSONService {

    constructor(private http: Http){}
   public getJSON(url): Observable<any> {
        return this.http.get(url).map((res:any) => res);
    }
}