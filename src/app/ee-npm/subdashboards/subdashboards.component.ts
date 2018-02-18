import { Component, OnInit } from '@angular/core';
import { DataLoadSpinner } from '../services/dataLoadSpinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SubdashboardsService } from '../services/http/subdashboards/subdashboards.service';
 import { LocalStorageService} from 'angular-2-local-storage';
@Component({
  selector: 'app-subdashboards',
  templateUrl: './subdashboards.component.html',
  styleUrls: ['./subdashboards.component.css']
})
export class SubdashboardsComponent implements OnInit {
  dashboardId:any;
  subDashboards:Array<any>=[];
  subtype:any="line";
  breadcrumbs :any ;

  constructor(private router: Router, private route: ActivatedRoute , private subdashboardsService : SubdashboardsService,private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.route.url.subscribe(() => {
 if(this.router.url.match('subdashboards') ){
  this.dashboardId = this.route.snapshot.params["dashboardId"];
  let menu :any = this.localStorageService.get('menu');
  let currentDashboard:any;
  menu.filter((link)=>{
    if(link.id=='1'){
      let dash = link.subMenu.filter((dash)=>{
        if(dash.id == this.dashboardId){
          currentDashboard = dash;
        }
      })
    }
   })
   this.breadcrumbs={mainlink:"Dashboard",sublinks:[{displayName:currentDashboard.displayName,id:this.dashboardId,routing :currentDashboard.routing}]}
   this.localStorageService.set('breadcrumbs',this.breadcrumbs);
          let request :any = {
            "dashboardId" : this.dashboardId
          };
          this.subdashboardsService.getSubDashboardsForDashboard(request).subscribe(data=>{
             if(data && null != data)
             {
               this.subDashboards = data.subDashboards;
             }
          });
 }
    });

  }

  getSpecificSubDashboard(subDashboard)
  {
this.router.navigateByUrl('/dashboard/'+subDashboard.dashboardId+'/subdashboard/'+subDashboard.subDashboardId);
  }

  getSpecificReport(report,subDashboard)
  {  let menu :any = this.localStorageService.get('menu');
  let currentDashboard:any;
  menu.filter((link)=>{
    if(link.id=='1'){
      let dash = link.subMenu.filter((dash)=>{
        if(dash.id == this.dashboardId){
          currentDashboard = dash;
        }
      })
    }
   })
     this.breadcrumbs={mainlink:"Dashboard",sublinks:[{displayName:currentDashboard.displayName,id:this.dashboardId,routing :currentDashboard.routing},{displayName:subDashboard.name,id:this.dashboardId,routing :'/dashboard/'+subDashboard["dashboardId"]+'/subdashboard/'+subDashboard["subDashboardId"]}]}
   this.localStorageService.set('breadcrumbs',this.breadcrumbs);
     this.router.navigate(['/report/' + report.userTemplateId + '/dashboardReport']);
  }
}
