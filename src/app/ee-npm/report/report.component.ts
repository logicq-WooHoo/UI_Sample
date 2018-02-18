

import { CommonFieldErrorUtilService } from '../services/common/common.field-error.util';
import { GetreportService } from '../services/http/report/getreport.service';
import { DataLoadSpinner } from '../services/dataLoadSpinner.service';
import {ActivatedRoute,Router} from '@angular/router';
import { Component, OnInit ,OnChanges, SimpleChanges } from '@angular/core';
 import { LocalStorageService} from 'angular-2-local-storage';
 import {CommonParsingService} from '../services/common/common.parsing.service';
 import {CommonGetterSetterService} from '../services/common/common.getterSetter.service';
 import {DashboardService} from '../services/http/dashboard/dashboard.service';
 import { MenuService } from '../services/menu/menu.service';
 declare var $:any;
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers:[DashboardService]
})
export class ReportComponent implements OnInit {
exportFileTypes:any;
report :any ={chartResp:[],tableResp:{}};
reportId="";
exportType :string;
toggleActive:boolean = true;
isCollapsed:boolean =false;
resetForm:boolean = false;
menuToggled:boolean = false;
isDashboardReport:boolean=false;
subDashboardReportConfigList : Array<any>=[];
breadcrumbs:any;
  constructor(private router:Router,private route : ActivatedRoute,private localStorageService:LocalStorageService,private reportService:GetreportService,private commonParsingService: CommonParsingService,private commonGetterSetterService:CommonGetterSetterService,private dashboardService :DashboardService,private menuService:MenuService ) { }

  ngOnInit() {
     this.menuService.getToggledValue().subscribe((data) => {
      this.menuToggled = data.value;
      // this._chart.redraw();
    });
    this.exportFileTypes =["CSV","PDF","XLS"];
    this.route.url.subscribe(()=>{
      if(this.router.url.match('report') || this.router.url.match('dashboardReport')){
        if(this.route.snapshot.params && this.route.snapshot.params["reportId"]){
           let request ={"userName":this.localStorageService.get('userName'),};
          let apiService : any;
          if(this.route.snapshot.params["type"] && !this.route.snapshot.params["type"].match('userReport')){
             request["isDashboardReport"]=true;
             this.isDashboardReport=true;
          }else
              { request["isDashboardReport"]=false;
              this.isDashboardReport=false;
        }
          
          request["userTemplateId"]=this.route.snapshot.params["reportId"];
          apiService = this.reportService.getUserReport(request);
          this.reportId = this.route.snapshot.params["reportId"];
          this.subDashboardReportConfigList = this.commonGetterSetterService.getSubDashboardReportConfigList();
          console.log(" this.subDashboardReportConfigList") ;
          console.log( this.subDashboardReportConfigList);
          apiService.subscribe((data)=>{
             let dashBoardViewBoth ;
            //  if(data ){
            //  if(data.reports){
            //   dashBoardViewBoth = data.view =='both' ? true:false;
            //   if(data.reports && data.reports.length>0){
            //     data = JSON.parse(JSON.stringify(data.reports[0]));
            //   }
            // }else{
            //    this.report.chartResp.showGraph = false;
            //  }
            //  }
           if( data.reportConfiguration){
            if(data.reportConfiguration.configuration.type == "both" || data.reportConfiguration.configuration.type.toLowerCase() == "graph" || dashBoardViewBoth){
             this.report.chartResp = data;
            this.report.chartResp.showGraph = true;
            }
            this.report.tableResp = this.commonParsingService.parseRestTableResponse(data);
            this.report.type= data.reportConfiguration.configuration.subType;
           this.report.name= data.reportConfiguration.configuration.name;
           this.report.intervals  =data.reportConfiguration.intervals.match('/') ? this.getInterval(data.reportConfiguration.intervals) : data.reportConfiguration.intervals;
           this.report.deviceType = data.reportConfiguration.configuration.deviceType;
           this.report.granularity = data.reportConfiguration.granularity =='ALL' ? 'RAW' : data.reportConfiguration.granularity ;
           this.report.level = data.reportConfiguration.level;
         let reportConfigMap = this.commonGetterSetterService.getReportConfiguration();
         if(!reportConfigMap || !reportConfigMap.get(this.reportId) || reportConfigMap==null){
           reportConfigMap.set(this.reportId,data.reportConfiguration);
           this.commonGetterSetterService.setReportConfiguration(reportConfigMap);
         }
             }
               if(this.isDashboardReport){
             this.breadcrumbs = this.localStorageService.get('breadcrumbs');
         let sublinks = this.breadcrumbs.sublinks.filter((links,index)=>{
          return index<2
         });
            this.breadcrumbs.sublinks = [];
            this.breadcrumbs.sublinks = sublinks;
             this.breadcrumbs.sublinks.push({displayName:this.report.name,id:this.reportId,routing :'/report/' + this.reportId + '/dashboardReport'})
             
         }else{
          this.breadcrumbs={mainlink:"My Reports",sublinks:[{displayName:this.report.name,id:this.reportId,routing :'/report/' + this.reportId + '/dashboardReport'}]}
         }
         this.localStorageService.set('breadcrumbs',this.breadcrumbs);
           },(err)=>{
      console.log(err);
      this.commonGetterSetterService.setReportConfiguration(null);
    })
    
         }
      }
    })
       
  }

getTemplateConfig(){

this.router.navigate(['/editReport/'+this.reportId]);
}
  getInterval(interval){
    let int = interval.split('/');
    let from = this.commonParsingService.formatDate(int[0]);
    let to = this.commonParsingService.formatDate(int[1]);
return [from,to].join(' to ')
  }

  exportReport(type){
    let request = {};
    request["userName"]=this.localStorageService.get('userName');
    request['userTemplateId'] = this.reportId;
    request["fileType"] = type;
    this.reportService.exportUserReport(request).subscribe((data)=>{
       if(null!=data && data!=undefined ){
          var l = document.createElement('a');
          l.download = 'chart';
          l.href = data['downloadURL'];
          if(null!=data['downloadURL'] && data['downloadURL']!=undefined){
            window.open(l.href);
            document.body.appendChild(l);
            document.body.removeChild(l);
          }
        }
    },(err)=>{
      console.log(err);
    })
  }

  ngAfterViewInit(){
    let parent =this;
    console.log($("a.exportReport"));
     $("a.exportReport").click(function () {
         var tablink = $(this).attr('title');
         $("#"+tablink).fadeIn();
         $(this).parents(".reportMenu").find('li').removeClass("active");

         if(!$(this).hasClass("disabled")){
           $(this).parents(".reportMenu li").addClass("active");
         }

         return false;
     });
     $(".closeButton").click(function(){
         $(this).parents(".reportMenu").find('li').removeClass("active");
         $(".tabHolder").fadeOut();
         this.cleardata("true")
      });

      $('.dropdown').focus(function() {
            $(this).siblings('div.drop-list').removeClass('hide');
            $(this).siblings('div.drop-list').addClass('show');
                if($(this).parents().siblings().length>0){
                if($(this).parents().siblings().find('div.drop-list').hasClass('show')){
                  $(this).parents().siblings().find('div.drop-list').removeClass('show');
                  $(this).parents().siblings().find('div.drop-list').addClass('hide');
                }
            }
          }).blur(function () {
      if($('div.drop-list:hover') &&  $('div.drop-list:hover').length == 0){
        $(this).siblings('div.drop-list').removeClass('show');
      $(this).siblings('div.drop-list').addClass('hide');
      
      }
 
    });
    console.log($(".action-menu"));
    $(".action-menu> li > a.action-menu-tab").click(function () {
      var tablink = $(this).attr('href');
      $(tablink).fadeIn();
      $(this).parents(".action-menu").find('li').removeClass("active");
      $(this).parents(".action-menu").find('li').find('a.action-menu-tab').addClass("active");
      if(!$(this).hasClass("disabled")){
        $(this).parents(".action-menu li").addClass("active");
      }

      return false;
  });
 
  

  }

  setModalValues(type,event){
    this.exportType = type;
    this.hideDropdownClick(event);
  }

  hideDropdownClick(event) {
    $(event.currentTarget).parents('div.drop-list').removeClass('show').addClass('hide');
  }

  cleardata(value){
    if(value == "true"){
       this.exportType = "";
    }
    console.log(value);
   
  }

   showPageAction(){
    $('div.fixed-action').toggle('slide',{"direction":"right"});  
    this.isCollapsed = !this.isCollapsed;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.resetForm = !this.resetForm;
  }


  getUserReport()
  {
    
  }
}
