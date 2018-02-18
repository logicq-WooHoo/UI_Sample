import { Component, OnInit } from '@angular/core';
import { CommonParsingService } from '../services/common/common.parsing.service';
import { ConfigService } from '../services/config/config.service';
import { ActivatedRoute ,Router ,NavigationEnd} from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

date:any;
routingParams :any;
menu:any;
 offset = this.configService.getConfiguration().offset;
  constructor(private commonParsingService:CommonParsingService , private configService:ConfigService,private router :Router) { }

  ngOnInit() {
    this.date = this.commonParsingService.formatDate(new Date(),this.offset);
     
  }

  checkRoutes(){
  //this.activatedRoute.url.subscribe(()=>{
    let menu = [{headerClass:"header-dashboard",url:"/subdashboards/"},{headerClass:"header-report",url:"/report/"},{headerClass:"header-kpi",url:"/kpiCreation"},{headerClass:"header-counters",url:"/dynamicCounterAddition"}]
    let url = this.router.url;
    let obj ={};
    let link0 = menu.filter((links)=>{
      return (url.indexOf(links.url)>=0)
    })
    if(link0 && link0.length>0){
      let clss= link0[0]["headerClass"];
      obj[clss] = true;
      return obj
    }
  }
   
  //});


}
