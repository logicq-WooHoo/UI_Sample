import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MenuService } from '../services/menu/menu.service';
import { ActivatedRoute ,Router ,NavigationEnd} from '@angular/router';
 import { LocalStorageService} from 'angular-2-local-storage';
declare var $: any;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']

})
export class MenuComponent implements OnInit {
  // toggleClass:boolean = false;
  // @Output() toggleClassEvent =new EventEmitter();
  menu: any;

  constructor(private menuService: MenuService,private router :Router,private localStorageService:LocalStorageService ,private activatedRoute :ActivatedRoute) { 
   
  }

  ngOnInit() {
    this.menu = [{ displayName: "Dashboard",id:"1", icons: "span dashboard-icn",class:"item-8 deeper parent link-dashboard", routing: "/subdashboards", subMenu: [], toggle: false },{ displayName: "My Reports",id:"2",class:"item-8 deeper parent link-report", icons: "span report-icn", routing: "/report", subMenu: [], toggle: false }, { displayName: "Manage KPI",id:"3",class:"item-8 deeper parent link-kpi", icons: "span settings-icn", routing: "/kpiCreation", subMenu: [], toggle: false },
    { displayName: "Dynamic Counter Addition",id:"4",class:"item-8 deeper parent link-counters", icons: "span counters-icn", routing: "/dynamicCounterAddition", subMenu: [], toggle: false }]
   let menu :any= this.localStorageService.get('menu');
   if(menu){
    this.menu = menu;
     this.localStorageService.set("menu",this.menu);
   }
        
   
       this.menuService.getMenuSubject().subscribe((data) => {
         let menuData=this.menuService.getMenu();
      let menu1 =menuData && menuData.reports ? menuData.reports :menuData;
      let i :number=0;
      let index;
      let obj1 ={ displayName: "Create Report", icons: "span report-icn", routing: "/createReport", subMenu: [], toggle: false };
      if(menu1!=null &&  menu1 && data!=null ){
        for(let m of this.menu){
          if(m.id== "2"){
          let obj =menu1;
          if(data && data.value && data.value !="Menu added" && data.value!=null){
            obj=[];
            obj.push(menu1);
          }
             obj.forEach((r,j)=>{
          r["displayName"]=r.reportName;
          r["routing"] = "report/"+ r.userTemplateId+'/userReport';
          r["toggle"]=false;
          r["subMenu"]=[];
         });
         if(data && data.value && data.value !== "Menu updated"){

          m["subMenu"]=obj;
          }else if(data.value == "Menu updated") {
             m["subMenu"].push(obj[0]);
             if($("#sub-menu-"+index).hasClass('collapsed')){
                this.toggle("#sub-menu-"+index,'ul.expanded');
             }
             
          }
       
       break;
        }
        i++;
        }    
      
      }
      if(menuData != null && menuData.dashboards !=null)
      {
      
        let obj = menuData.dashboards;
        for (let m of this.menu) {
          if (m.id == 1) {
            obj.forEach((d, j) => {
              d["displayName"] = d.name;
              d["routing"] = "/subdashboards/" + d.id;
              d["toggle"] = false;
              if(d.reports && d.reports.length >0){
              d["subMenu"]=[];
                d.reports.forEach((r)=>{
                   r["displayName"]=r.reportName;
          r["routing"] = "/dashboard/"+ r.userTemplateId+'/dashboardReport/'+d.id;
          r["toggle"]=false;
          r["subMenu"]=[];
          d["subMenu"].push(r);
                })
              }else{
              d["subMenu"] = [];
              }
            });
            m["subMenu"] = obj;
          }

      }
    }
     this.localStorageService.set("menu",this.menu);
       });
       
    this.menuService.getToggledValue().subscribe((data) => {
      if (data.value) {
        this.toggle('ul.expanded', 'closeAll');
      }
    });
  }

  toggle(selector, close?,link? ) {
    $(selector).siblings('a').find('i.icon-white').toggleClass('icon-minus');
    // if ($(selector).parent().hasClass('active')) {
    //   $(selector).parent().removeClass('active');
    // }
    // else { $(selector).parent().addClass('active'); }
    
    if ($(selector).length > 0) {

      if (close == 'closeAll') {
        $(selector).slideUp("fast");
        $(selector).toggleClass('collapsed').toggleClass('expanded');
        $(selector).parent().removeClass('active');
      } else if (close != undefined) {
        $(selector).slideToggle("fast");
        $(selector).toggleClass('collapsed').toggleClass('expanded');
        let elementSelector1 = 'ul.expanded:not([id^=' + selector.replace("#", "") + '],[class=nav])';
        if ($(elementSelector1).length > 0) {
          $(elementSelector1).slideUp("fast");
          $(elementSelector1).siblings('a').find('i.icon-white').toggleClass('icon-minus');
          $(elementSelector1).toggleClass('collapsed').toggleClass('expanded');
        }
        if ($(selector).hasClass('collapsed')) {
          let elementSelector = selector + ' ul[id^=' + selector.replace("#", "") + ']';
          if ($(elementSelector).hasClass('expanded')) {
         this.toggle(elementSelector, 'closeAll');
          }
        }
      }
      else {
        $(selector).slideToggle(200);
        $(selector).toggleClass('collapsed').toggleClass('expanded');
      }
    }

    if(link && link!='/report' && link!='/subdashboards'){
      this.redirectTo(link);
    }
  }

  redirectTo(link){
    if(link.length>0){
    this.router.navigate([link]);
    }
  }

  ngAfterViewInit() {
    this.menuHide();
    this.showCustomScrollbar('.overflow-div');
    //this.toggle("#sub-menu-"+0,'ul.expanded');
  }

checkRouteParam(link){

  return {
    'active': this.checkRoutes(link)
  };
  
}

checkRoutes(link){
  //this.activatedRoute.url.subscribe(()=>{
    let url = this.router.url;
    if(link==null || link==""){
      return false;
    }
    else if(url.indexOf(link)>=0){
      return true;
    }else false;
  //});
}
menuHide(){
    $('ul[id^=sub-menu-]').css('display', 'none');
}

showCustomScrollbar(elem) {
  console.log( $(elem));
     $(elem).mCustomScrollbar({
       theme: "minimal",
       advanced: {
         autoScrollOnFocus: false,
         updateOnContentResize: true
       }
     });
    }


}
