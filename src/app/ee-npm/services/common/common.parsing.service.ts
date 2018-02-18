
import { Injectable, Inject } from '@angular/core';
import { Http, Headers, RequestOptions, Response, RequestMethod, Request } from '@angular/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'angular-2-local-storage';
import { CommonGetterSetterService } from './common.getterSetter.service';
import { DataLoadSpinner } from '../dataLoadSpinner.service';
import { ConfigService } from '../config/config.service';
import { AppConfig } from '../../../configurations/app.config';
import 'rxjs/add/operator/map';
declare var require: any;
const moment = require('moment-timezone/builds/moment-timezone-with-data-2012-2022');

@Injectable()
export class CommonParsingService {
  constructor(private commonGetterSetterService: CommonGetterSetterService, private appConfig: AppConfig, private configService: ConfigService, private dataLoadSpinner: DataLoadSpinner) { }
  public offsetHours =this.configService.getConfiguration
  getDisplayName(key, metric) {
    let metricNameMap = this.commonGetterSetterService.getCounterNamesMap();
    if (key.indexOf(metric) >= 0) {
      let name = key.replace(metric, metricNameMap.get(metric).displayName + " (" + metricNameMap.get(metric).counterUnit + ")");
    }
    return name;
  }

  // parseRestTableResponse(data){
  //      let tableResponse = { headers: [], data: [] };
  //   if(data && data.response && data.response[0] && data.response[0].events && data.response[0].events.length>0){
  //     let object0 =data.response[0].events[0];
  //     let metricNameMap = this.commonGetterSetterService.getCounterNamesMap();
  //     let response = data ;


  //       for(let keys in object0){
  //         if(keys!='timestamp'){
  //     for(let metric of response.metrics){
  //       if(!metricNameMap.has(metric.counterId)){
  //         metricNameMap.set(metric.counterId, metric);
  //       }
  //       let displayName= this.getDisplayName(keys,metric.counterId);
  //       if(this.getDisplayName(keys,metric.counterId)){
  //         tableResponse["headers"].push({ id: keys, displayName: displayName });
  //       }

  //     }
  //         }
  //   }
  //    tableResponse["headers"].unshift({id:"timestamp" ,displayName : "TimeStamp" });
  //   let obj = [];
  //   for(let eventOb of data.response[0].events){
  //     obj.push({ event: eventOb });
  //   }
  //      tableResponse["data"] = obj;
  //   }

  //   return tableResponse ;
  // }

  parseRestKPITableResponse(data) {
    let tableResponse = { headers: [], data: [] };
    if (data && data.response && data.response[0] && data.response[0].events && data.response[0].events.length > 0) {
      let metric = data.metrics;
      let kpiMetrics= data.kpiMetrics;
      let response = data;
      let events =data.response[0].events;
      let eventKeys = data.response[0].events[0];
       
        for(let keys in eventKeys){
        if(isNaN(parseFloat(keys)) && keys!='timestamp'  ){
           tableResponse["headers"].push({id: keys, displayName: keys});
        }
      }
      kpiMetrics.forEach((e, i) => {
        let id= e.id;
        tableResponse["headers"].push({ id: id, displayName: e.displayName + ' ('+e.unit+')'});
      });
        // kpiMetrics.forEach((e, i) => {
        // let id= e.displayName;
        // id= e.aggregationType =='AVG' ? e.displayName+'_AVG' : e.displayName;
        // tableResponse["headers"].push({ id: id, displayName: e.displayName});
        // });
      tableResponse["headers"].unshift({ id: "timestamp", displayName: "TimeStamp" });
      let arr =[];
      for (let eventOb of events) {
        arr.push(eventOb);
      }
      tableResponse["data"] = arr;
    }
    return tableResponse;
  }

  parseRestTableResponse(data) {
    let tableResponse = { headers: [], data: [] };
    if (data && data.response && data.response[0] && data.response[0].events && data.response[0].events.length > 0) {
      let metric = data.response[0].metrics;
      let response = data;
      let events =data.response[0].events;
      let eventKeys = data.response[0].events[0];
      // for(let keys in eventKeys){
      //   if(isNaN(parseFloat(keys)) && keys!='timestamp'  ){
      //      tableResponse["headers"].push({id: keys, displayName: keys});
      //   }
      // }

      let Objectkeys=[];
      data.metrics.forEach((e, i) => {
        let id= e.counterId;
          let children =[];
          let singleAggregation=undefined;
        let aggregationList = e.aggregationList;
        if(aggregationList && aggregationList.length >1){
          
          aggregationList.forEach((aggregation)=>{
            children.push({id: aggregation+'_'+id, displayName: aggregation,value:"number"});
            if(Objectkeys && Objectkeys.indexOf(aggregation+'_'+id)<0){
              Objectkeys.push(aggregation+'_'+id);
            }
          })
        }else if(aggregationList && aggregationList.length ==1){
          singleAggregation = aggregationList[0]+'_'+id;
           if(Objectkeys && Objectkeys.indexOf(aggregationList[0]+'_'+id)<0){
              Objectkeys.push(aggregationList[0]+'_'+id);
            }
       }else{
          Objectkeys.push(id.toString());
        }
        
        id= e.aggregationType =='AVG' ? e.counterId+'_AVG' : e.counterId;
        if(singleAggregation){
          tableResponse["headers"].push({ id: singleAggregation, displayName: e.displayName + ' ('+e.counterUnit+')',value :"number" ,width:120});
        }else{
          tableResponse["headers"].push({ id: id, displayName: e.displayName + ' ('+e.counterUnit+')',children :children ,value:"number",width:120});
        }
        
       
      });

       for(let keys in eventKeys){
        if(Objectkeys.indexOf(keys)<0 && keys!='timestamp'  ){
           tableResponse["headers"].unshift({id: keys, displayName: keys,value:"text" , width:200});
        }
      }
      tableResponse["headers"].unshift({ id: "timestamp", displayName: "TimeStamp" ,children :[]});
      let arr =[];
      for (let eventOb of events) {
        arr.push(eventOb);
      }
      tableResponse["data"] = arr;
    }else{
      this.dataLoadSpinner.showErrorMessage("Data not available for the given interval");
    }
    return tableResponse;
  }

  getParsedRestChartResponse(data) {
    let seriesData = [];
    if (data && data.response && data.response[0] && data.response[0].events && data.response[0].events.length > 0) {
      let response = data.response[0];
      let dataInner = [];
      let subElementsArr = [];

      let nodeName = "";
      if(data.metrics!=null && data.metrics.length >0){
         for (let metric of data.metrics) {
       
          let dataOuter = [];
          for (let eventOb of response.events) {
              dataInner = [];
              dataInner.push(new Date(eventOb["timestamp"]).getTime(), parseInt(eventOb[metric.counterId]));
              dataOuter.push(dataInner);
            }
             seriesData.push({ name: metric.displayName , data: dataOuter, id: metric.displayName});
          } 
      }else{
        for (let metric of data.kpiMetrics) {
       
          let dataOuter = [];
          for (let eventOb of response.events) {
              dataInner = [];
              dataInner.push(new Date(eventOb["timestamp"]).getTime(), parseInt(eventOb[metric.displayName]));
              dataOuter.push(dataInner);
            }
             seriesData.push({ name: metric.displayName , data: dataOuter, id: metric.displayName});
          } 
      }
        
    }
    return seriesData;
  }


  // getParsedRestChartResponse(data){
  //    let seriesData = [];
  //     if(data && data.response && data.response[0] && data.response[0].events && data.response[0].events.length>0){
  //   let object0 =data.response[0].events[0];

  //       let metricNameMap = this.commonGetterSetterService.getCounterNamesMap();
  //       let response = data ;
  //       let dataOuter =[];

  //      let response1 =data.response[0].events.sort((obj1, obj2) =>{
  //      let  timestamp1 = new Date(obj1["timestamp"]).getTime();
  //       let  timestamp2 = new Date(obj2["timestamp"]).getTime();

  //                 if (timestamp1 < timestamp2) return -1;
  //                 if (timestamp1 > timestamp2) return 1;
  //                 if (timestamp1 == timestamp2) return 0;

  //      });

  //          for(let keys in object0){
  //            dataOuter = [];
  //            if(keys!='timestamp'){
  //            let dataInner =[];
  //         for(let eventOb of response1){
  //         dataInner =[];
  //         dataInner.push(new Date(eventOb["timestamp"]).getTime(),eventOb[keys]);
  //         dataOuter.push(dataInner);
  //       }
  //        seriesData.push({name:  keys ,data : dataOuter , id:keys });
  //          }

  //         }


  //       for(let metric of response.metrics){
  //          for(let series of seriesData){
  //         let displayName= this.getDisplayName(series["name"],metric.counterId);
  //         if(this.getDisplayName(series["name"],metric.counterId)){
  //          series["name"] = displayName ;
  //         }
  //          }
  //       }
  //     }

  //  return seriesData;
  // }


  formatDate(indate, offset?,offsetHours?) {
    //let date: Date = new Date(indate);


    // var d = new Date(date),

    //   month = '' + (date.getUTCMonth() + 1),
    //   day = '' + date.getUTCDate(),
    //   year = date.getUTCFullYear(),
    //   hour = '' + date.getUTCHours(),
    //   minutes = '' + date.getUTCMinutes();

    // if (month.length < 2) month = '0' + month;
    // if (day.length < 2) day = '0' + day;
    // if (hour.length < 2) hour = '0' + hour;

    // if (minutes.length < 2) minutes = '0' + minutes;


    // let newdate = [month, day, year].join('/');
    // let time = [hour, minutes].join(':');

    if(offsetHours){
     return  moment(indate).subtract(offsetHours, 'hours').tz(offset).format('MM/DD/YYYY HH:mm')
    }else if(offset){
       return moment(indate).tz(offset).format('MM/DD/YYYY HH:mm');
    }else{
      let date: Date = new Date(indate);
      var d = new Date(date),

      month = '' + (date.getUTCMonth() + 1),
      day = '' + date.getUTCDate(),
      year = date.getUTCFullYear(),
      hour = '' + date.getUTCHours(),
      minutes = '' + date.getUTCMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;

    if (minutes.length < 2) minutes = '0' + minutes;


    let newdate = [month, day, year].join('/');
    let time = [hour, minutes].join(':');
      return [newdate, time].join(' ');
    }

   
     // else {
    //   return [newdate, time].join(' ');
    // }

  }
}