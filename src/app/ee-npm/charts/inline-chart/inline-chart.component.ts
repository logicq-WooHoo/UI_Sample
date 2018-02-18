import { Component, OnInit, Input, ViewChild, ElementRef,SimpleChange,ChangeDetectorRef } from '@angular/core';
import {ChartComponentInt} from '../chart.utility';
import { CommonParsingService } from '../../services/common/common.parsing.service';
import { CommonHighchartsOptionsService } from '../../services/common/common.highcharts.options.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var require, $: any;
import { Observable,BehaviorSubject,Subject } from 'rxjs';
const Highstock = require('highcharts/highstock.src');
const Highcharts = require('highcharts/highcharts.src');
require('highcharts/modules/exporting.js')(Highcharts);
require('highcharts/modules/offline-exporting.js')(Highcharts);
require('highcharts/modules/boost.js')(Highcharts);
@Component({
  selector: 'app-inline-chart',
  templateUrl: './inline-chart.component.html',
  styleUrls: ['./inline-chart.component.css']
})
export class InlineChartComponent implements ChartComponentInt {

  @Input() data: any;

  @ViewChild('chart') public _chart: any;

  @Input() menuToggle : any = new Subject();
  @Input() deviceType: any;
  @Input() index:any="0";
  series :any;
  search: string;
  filteredData: any;
  seriesData:any;
  refreshedData: any = new Subject();
  type:any = new BehaviorSubject(<any>(undefined));
  chartType:any;
  @Input() 
 height:any;
  charTy:any = {displayName:""};
   dimensionValue :any =[];
   dimensionKeys :any =[];
   dimensions:any={};
   showFilter :any= false;
   isSubDashboard = false;

   showChartTypeSelect:any=true;
  types = [{id:"Bar",displayName:"Bar"},{id:"Vertical Bar",displayName:"Vertical Bar"},{id:"Horizontal Bar",displayName:"Horizontal bar"},{id:"line",displayName:"Line"},{id:"Spline",displayName:"Spline"},{id:"areaspline",displayName:"Area Spline"},{id:"Vertical Stacked Bar",displayName:"Vertical Stacked Bar"}];
  constructor(private commonParsingService : CommonParsingService,private commonHighchartsOptionsService : CommonHighchartsOptionsService,private cdr: ChangeDetectorRef,private router:Router) { }

  // ngOnChanges(changes : {[propKey: string]: SimpleChange}) {
    
    
  // }

  ngOnInit(){
    
        if(this._chart &&  typeof this._chart.setSize === 'function'){
     let height= 320;
     if(this.height && this.height!=0){
        height = this.height;
         }
      if(this.menuToggle){
     this._chart.setSize(null,height);
      }else{
         this._chart.setSize(null,height);
      }
    }
    this.refreshedData.subscribe((data)=>{
      this.addPoint(data);
    });
    let parent = this;
    this.menuToggle.subscribe((data)=>{
         parent.redraw(data);
    })
   
      if(!this.router.url.match('/dashboard/') || (this.router.url.match('/dashboard/') && this.router.url.match('/dashboardReport/'))){
        this.showFilter =true;
    }
     if(this.router.url.match('/createReport')){
        this.showChartTypeSelect = false
    }

    if(this.router.url.match('subdashboard')){
        this.isSubDashboard = true;
    }
  }
  redraw(val){
     var w = $('#chart'+this.index).parents('.'+val.class).width();
     console.log(w);
        // setsize will trigger the graph redraw 
       if(!val.toggle){
            w=w-80;
            if(val.class=='col-md-12'){
                w=w-50;
            }
        }else{
            w=w+20;
             if(val.class=='col-md-12'){
                w=w+100;
            }
        }
        this._chart.setSize(       
            w,this.height,true
        ); 
  }

ngAfterViewInit(){
   if (this.data) {
      this._chart = new Highstock.stockChart("chart"+this.index, this.getOptionParsingInitialData());
   }
    this.type.subscribe((data)=>{
       // if(data == "Spline" || data == "Vertical Stacked Bar" || data =="Horizontal Bar"){
     this._chart = new Highstock.stockChart("chart"+this.index, this.createChartWithChangedOption(data,'refresh'));
     this.chartType = data;
        //}
    });
    this.cdr.detectChanges();
  

}

export(){
   Highstock.getSVG = function (charts, options, callback) {
    var svgArr = [],
        top = 0,
        width = 0,
        addSVG = function (svgres) {
            // Grab width/height from exported chart
            var svgWidth = +svgres.match(
                    /^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/
                )[1],
                svgHeight = +svgres.match(
                    /^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/
                )[1],
                // Offset the position of this chart in the final SVG
                svg = svgres.replace('<svg', '<g transform="translate(0,' + top + ')" ');
            svg = svg.replace('</svg>', '</g>');
            top += svgHeight;
            width = Math.max(width, svgWidth);
            svgArr.push(svg);
        },
        exportChart = function (i) {
            if (i === charts.length) {
                return callback('<svg height="' + top + '" width="' + width +
                  '" version="1.1" xmlns="http://www.w3.org/2000/svg">' + svgArr.join('') + '</svg>');
            }
            charts[i].getSVGForLocalExport(options, {}, function () {
                console.log("Failed to get SVG");
            }, function (svg) {
                addSVG(svg);
                return exportChart(i + 1); // Export next only when this SVG is received
            });
        };
    exportChart(0);
};

/**
 * Create a global exportCharts method that takes an array of charts as an argument,
 * and exporting options as the second argument
 */
Highstock.exportCharts = function (charts, options) {
    options = Highstock.merge(Highstock.getOptions().exporting, options);

		// Get SVG asynchronously and then download the resulting SVG
    Highstock.getSVG(charts, options, function (svg) {
        Highstock.downloadSVGLocal(svg, options, function () {
            console.log(svg);
        });
    });
};

// Set global default options for all charts
Highstock.setOptions({
    exporting: {
        fallbackToExportServer: false // Ensure the export happens on the client side or not at all
    }
});
   Highstock.exportCharts([this._chart], {
        type: 'application/pdf'
    });

   
}

addPoint(data){
    let seriesCombineData :any ;
    if (data ) {
                seriesCombineData = this.commonParsingService.getParsedRestChartResponse(data);
                seriesCombineData =data;
            }
            
            for (let series of this._chart.series) {

                if (seriesCombineData != undefined && seriesCombineData.length > 0) {
                    for (let ser of seriesCombineData) {
                        if (series.name == ser.name) {
                            for(let seriesData of ser.data){
                                 let x = seriesData[0];
                                let y = seriesData[1];
                                series.addPoint([x, y], true, false);
                               this.seriesData.forEach((_series)=>{
                                    if(_series.name == ser.name){
                                      let data=[];
                                      data.push(seriesData[0]);
                                      data.push(seriesData[1]);
                                      _series.data.push(data);
                                    }
                                })
                            }
                        }
                    }
                }

            
            }
  }

  addSeries(seriesSelected,val) {
      if(val){
        let series = this.seriesData.filter((_series) => {
        return _series.name.match(seriesSelected+'_');
      })
      let addSeries = true;
      for(let ser of series){
       for(let sers of this.filteredData){
            if(sers.name == ser.name){
                addSeries =false;
            }
          }
          if(addSeries){
              this.filteredData.push(ser);
            this._chart.addSeries(ser,true,false) ;
          }
      }
    }else{
        let filteredData = this.filteredData;
           for(let ser of filteredData){
          if(ser.name.match(seriesSelected+'_')){
              this._chart.get(ser.name).remove(true,false);
              this.filteredData = this.filteredData.filter((series)=>{
                return ser.name!=series.name
              });
          }
    }
      }
    
   
  }
  getOptionParsingInitialData(){
      let dataOnGraph = JSON.parse(JSON.stringify(this.data));
        this.dimensionValue=this.data.graphData.propertyValuesMap;
      this.dimensionKeys=[];
      let dimensions = {};
      let obj={};
        let defaultSeries =[];
       
      for(let keys in this.dimensionValue){
          if(!this.dimensions[keys]){
              this.dimensions[keys]=[];
          }
           let i=0;
          for(let dime of this.dimensionValue[keys]){
         //     if(i==0){
            obj = {name : dime,showEnable:true,id:dime};
            //   }else{
            // obj = {name : dime,showEnable:false,id:dime};
            //   }
             this.dimensions[keys].push(obj);
             i++;
          }
        this.dimensionKeys.push(keys);
        defaultSeries.push(this.dimensionValue[keys][0]);
      }
this.seriesData = dataOnGraph.graphData.seriesData ;
this.filteredData = dataOnGraph.graphData.seriesData;
// this.filteredData=[];
//     for(let id of defaultSeries){
//         let filteredData=[];
//         filteredData = this.seriesData.filter((_series)=>{
//             return _series.name.match(id+'_')
//         })
//         for(let ser of filteredData){
//             let addSeries =true;
//               for(let sers of this.filteredData){
//             if(sers.name == ser.name){
//                 addSeries =false;
//             }
//           }
//           if(addSeries){
//               this.filteredData.push(ser);
//           }
//         }
//     }
    
//     console.log(this.filteredData);
   
      //this.seriesData = dataOnGraph.graphData.seriesData ;//this.commonParsingService.getParsedRestChartResponse(dataOnGraph);
    //   this.filteredData = this.seriesData ;
    //   this.filteredData.forEach((value, i) => {
    //     if (this.seriesData.length >= 20) {
    //       if (i <20)
    //         $.extend(value, { showEnable: true });
    //       else
    //         $.extend(value, { showEnable: false });
    //     }else{
    //        $.extend(value, { showEnable: true });
    //     }

    //   });

    //   this.filteredData = this.filteredData.filter((_ser) => {
    //     return _ser.showEnable == true;
    //   });
    this.chartType = this.type.getValue();
        return this.createChartWithChangedOption(this.type.getValue());
  }

  changeChartType(element){
      this.charTy = element;
      let type= this.types.filter((ty)=>ty.displayName == element );
      this.type.next(this.charTy.id);
  }
typeChange(type){
console.log(type);
}
  createChartWithChangedOption(type,refresh?){
      let _current = this;
     let opts: any ;
     if(!type || type== null){
      type =  this.chartType;
     }
     if(!refresh){
          let type1 = this.types.filter((ty)=> ty.id ==this.chartType );
      this.charTy = type1[0];
     }
    
        if(type=='Spline' ){
          opts= this.commonHighchartsOptionsService.splineOptions();
        }else if(type=='line' ){
          opts= this.commonHighchartsOptionsService.lineOptions();
        }else if(type == 'Vertical Stacked Bar' || type == 'Vertical Bar'){
          opts= this.commonHighchartsOptionsService.columnOptions();
          opts.colors = ["#90ed7d",'#7cb5ec', '#2b908f','#e7ba08', '#90ed7d','#FFF263', '#6AF9C4','#058DC7', '#DDDF00', 
             '#FF9655'];
        }else if(type == 'Bar'){
        opts= this.commonHighchartsOptionsService.columnOptions();
        opts.plotOptions={ bar: {
            dataLabels: {
                enabled: true
            }
        }};
        }else if(type == 'Horizontal Bar'){
             opts= this.commonHighchartsOptionsService.columnOptions();
             opts.chart["inverted"] = true;
        }else if(type == 'areaspline'){
            opts = this.commonHighchartsOptionsService.areasplineOptions();
        }else{
           opts= this.commonHighchartsOptionsService.splineOptions(); 
        }

       
             opts.legend.itemStyle ={
            fontSize:'10px',
            textOverflow:'ellipsis'
        }
        opts.navigator ={
                height:20,
                margin:10
            
        }
        opts.scrollbar = {
            height : 14
        }
        
        if(!this.router.url.match('/dashboardReport/')){
            opts.legend.itemStyle.width = '170px';
        }
        
      if(this.isSubDashboard){
          //opts.tooltip.enabled= false;
          opts.legend.enabled = false;
          opts.navigator.enabled = false;
          opts.scrollbar.enabled = false;
      }
   
        opts.chart.events["load"] = function () {
            _current.series = this;
        }

 opts.chart["height"]=this.height;

        opts.series = this.filteredData;
        return opts;
  }

   showDropdown(event) {
    let elem: any = $(event.currentTarget).siblings('div.drop-list');
     let elem1: any = $(event.currentTarget).parents('.counter').siblings('div.drop-list');
    elem.removeClass('hide').addClass('show');
    elem1.removeClass('hide').addClass('show');
  }

  hideDropdown(event) {
    $(event.currentTarget).siblings('div.drop-list').removeClass('show').addClass('hide');
  }

  changeSeries(dimension,value,element){
 this.addSeries(element.name,element.showEnable);
  }
hasEnabled(dimension){
let arr = this.dimensions[dimension].filter((dim)=>{
    return dim.showEnable
})
return arr;
}

}
