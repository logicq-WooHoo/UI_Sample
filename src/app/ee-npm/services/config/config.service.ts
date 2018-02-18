import { Configuration } from '../../../configurations/configuration';
import { Injectable, Inject } from '@angular/core';
import { Http,Headers,RequestOptions,Response,RequestMethod,Request} from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class ConfigService {
   private config: Configuration;
   constructor(private http:Http) {}
  
  load(url:string) { 
    return new Promise((resolve, reject) => {
      this.http.get(url).map(res=>res.json())
        .subscribe(config => {
          this.config = config;
          resolve();
        });
  });
  }
  getConfiguration():Configuration {
    return this.config;
  }
}