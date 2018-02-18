import { Component, OnInit,ChangeDetectionStrategy,ViewChild } from '@angular/core';
import { CommonFieldErrorUtilService } from '../services/common/common.field-error.util';
import { CommonFieldArrayErrorUtilService } from '../services/common/common.array-field-error.util';
import { GetreportService } from '../services/http/report/getreport.service';
import { DataLoadSpinner } from '../services/dataLoadSpinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl,FormArray } from "@angular/forms";
import {VirtualScrollComponent} from 'angular2-virtual-scroll';
declare var $:any;
@Component({
  selector: 'app-dynamic-counter',
  templateUrl: './dynamic-counter.component.html',
  styleUrls: ['./dynamic-counter.component.css'],
  providers: [CommonFieldErrorUtilService,CommonFieldArrayErrorUtilService]
})
export class DynamicCounterComponent implements OnInit {

  addCounterForm: FormGroup;
  counterDetails:any;
  aggregationTypes =["SUM","MIN","MAX","AVG"];
  element:any;
  elements:any;
  counterGroup:any = {displayName:""};
  deviceTypeModel :any={counterGroup:[]};
  counterFormArray:FormArray;
  counterFormParent :FormGroup;
  isColllapsed :any=[];
  searchCounter:any;
  showMoreItems:boolean=false;
   @ViewChild(VirtualScrollComponent)
    private virtualScroll: VirtualScrollComponent;
  constructor(private getreportService: GetreportService, private formBuilder: FormBuilder, private dataLoadSpinner: DataLoadSpinner,public commonArrayFieldErrorUtilService: CommonFieldArrayErrorUtilService, public commonFieldErrorUtilService: CommonFieldErrorUtilService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.counterDetails ={displayName:"",id:"",aggregationType:{hourly:"",daily:"",monthly:"",yearly:""},description:"",unit:"",counterGroup:"",deviceType:""}
      this.setFormAttributes();
        this.getreportService.getDevices().subscribe(data => {
        if (data) {
          this.elements = data;
          // this.devices = data;
        }
      }, (err) => {
        console.log(err);
      });

      let counter = {displayName:"",unit:"",description:""};
      this.counterFormParent = this.formBuilder.group({
        "counters" : this.counterFormArray
      })
      //this.counterFormArray = this.formBuilder.array([this.createItem(counter)]);
  }


  selectDeviceType(device, $event?) {
    this.element = device;
    let request = {
      "deviceType": device
    };
    this.deviceTypeModel.counterGroup=[];
    this.getreportService.getCounterGroups(request).subscribe(data => {
      if (data) {
        this.deviceTypeModel.counterGroup = JSON.parse(JSON.stringify(data));
      }
    });

  }
  clearForm(){
    this.addCounterForm.reset();
  }


  selectedCounterGroup(counterGrp){
    this.counterGroup =  JSON.parse(JSON.stringify(counterGrp));
   this.getCounterList();
}

getCounterList(){
   this.counterGroup.counterList =[];
  this.clearForm();
   let request = {
        "counterGroups": [{ "counterGroupId": this.counterGroup.counterGroupId }]
        
      };
    this.getreportService.getCounterIDs(request).subscribe(data => {
          
          for (let controlgroup of data) {
            $.extend(controlgroup, { showEnable: true });
            if (controlgroup.counterGroupId == this.counterGroup.counterGroupId) {
                this.counterGroup.counterList = controlgroup.counterList;
              }
              
          }
           let formArray=[];
           for(let counter of this.counterGroup.counterList){
            // Object.assign ({isCollapse :false},...counter);
          //   this.isColllapsed.push(true);
          formArray.push(this.createItem(counter));
           }

          this.counterFormArray =this.formBuilder.array(formArray);
          this.counterFormParent.controls["counters"] = this.counterFormArray;
          this.commonArrayFieldErrorUtilService.setForm(this.counterFormParent);
        }, (err) => {
          console.log(err);
        });
}

getFormValid(){

}

toggle(index,control,key){
 let obj={};
 let val=!control.get(key).value;
  obj[key]=val;
 control.patchValue(obj);
}

createItem(item): FormGroup {
  return this.formBuilder.group({
    'displayName': new FormControl(item.displayName, [Validators.required]),
    'counterDescription': new FormControl(item.counterDescription, [Validators.required]),
    'counterUnit': new FormControl(item.counterUnit, [Validators.required]),
    'isCollapsed':new FormControl(false),
    'aggregation':new FormGroup({
      "hourSum":new FormControl(item.aggregation && item.aggregation.hourSum==1 ? true:false),
      "hourMin":new FormControl(item.aggregation && item.aggregation.hourMin==1 ? true:false),
      "hourMax":new FormControl(item.aggregation && item.aggregation.hourMax==1 ? true:false),
      "hourAvg":new FormControl(item.aggregation && item.aggregation.hourAvg==1 ? true:false),
      "daySum":new FormControl(item.aggregation && item.aggregation.daySum==1 ? true:false),
      "dayMin":new FormControl(item.aggregation && item.aggregation.dayMin==1 ? true:false),
      "dayMax":new FormControl(item.aggregation && item.aggregation.dayMax==1 ? true:false),
      "dayAvg":new FormControl( item.aggregation && item.aggregation.dayAvg==1 ? true:false),
      "weekSum":new FormControl(item.aggregation && item.aggregation.weekSum==1 ? true:false),
      "weekMin":new FormControl(item.aggregation && item.aggregation.weekMin==1 ? true:false),
      "weekMax":new FormControl(item.aggregation && item.aggregation.weekMax==1 ? true:false),
      "weekAvg":new FormControl(item.aggregation && item.aggregation.weekAvg==1 ? true:false),
      "monthSum":new FormControl(item.aggregation && item.aggregation.monthSum==1 ? true:false),
      "monthMin":new FormControl(item.aggregation && item.aggregation.monthMin==1 ? true:false),
      "monthMax":new FormControl(item.aggregation && item.aggregation.monthMax==1 ? true:false),
      "monthAvg":new FormControl(item.aggregation && item.aggregation.monthAvg==1 ? true:false),
      "yearSum":new FormControl(item.aggregation && item.aggregation.yearSum==1 ? true:false),
      "yearMin":new FormControl(item.aggregation && item.aggregation.yearMin==1 ? true:false),
      "yearMax":new FormControl(item.aggregation &&item.aggregation.yearMax==1 ? true:false),
      "yearAvg":new FormControl(item.aggregation && item.aggregation.yearAvg==1 ? true:false),
    })
  });
}





    setFormAttributes(details?) {
    if (!details) {
      details = this.counterDetails;
    }
    this.addCounterForm = new FormGroup({
      'name': new FormControl(details.displayName, [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern("^[a-zA-Z0-9 ]+$")]),
      'id':new FormControl(details.id, [Validators.required]),
      'aggregationType': this.formBuilder.group({
        "hourSum":new FormControl(false),
      "hourMin":new FormControl(false),
      "hourMax":new FormControl(false),
      "hourAvg":new FormControl(false),
      "daySum":new FormControl(false),
      "dayMin":new FormControl(false),
      "dayMax":new FormControl(false),
      "dayAvg":new FormControl(false),
      "weekSum":new FormControl(false),
      "weekMin":new FormControl(false),
      "weekMax":new FormControl(false),
      "weekAvg":new FormControl(false),
      "monthSum":new FormControl(false),
      "monthMin":new FormControl(false),
      "monthMax":new FormControl(false),
      "monthAvg":new FormControl(false),
      "yearSum":new FormControl(false),
      "yearMin":new FormControl(false),
      "yearMax":new FormControl(false),
      "yearAvg":new FormControl(false),
       }),
      'description': new FormControl(details.description, [Validators.required]),
      'unit': new FormControl(details.unit, [Validators.required]),
      'deviceType':new FormControl(details.deviceType),

    });
    this.commonFieldErrorUtilService.setForm(this.addCounterForm);
  }

  get name() { return this.addCounterForm.get('name'); }
  get id() { return this.addCounterForm.get('id'); }
  get hourly() { return this.addCounterForm.get('aggregationType.hourly'); }
  get daily() { return this.addCounterForm.get('aggregationType.daily'); }
  get monthly() { return this.addCounterForm.get('aggregationType.monthly'); }
  get yearly() { return this.addCounterForm.get('aggregationType.yearly'); }
  get description() { return this.addCounterForm.get('description'); }
  get unit() { return this.addCounterForm.get('unit'); }


 public get reportsArray(): FormArray {
    return this.counterFormParent.controls['counters'] as FormArray
  }
  

  ngAfterViewInit(){
     let parent= this;
     console.log($('.dropdown'));
    $('.dropdown').on({
      focus: function () {
        $(this).siblings('div.drop-list').removeClass('hide');
        $(this).siblings('div.drop-list').addClass('show');
         $(this).siblings('span.clear-btn').removeClass('hide');
        if ($(this).parents('div.form-group').siblings().children('div.dropdown').length > 0) {
          if ($(this).parents('div.form-group').siblings().children('div.dropdown').find('div.drop-list').hasClass('show')) {
            $(this).parents('div.form-group').siblings().children('div.dropdown').find('div.drop-list').removeClass('show');
            $(this).parents('div.form-group').siblings().children('div.dropdown').find('div.drop-list').addClass('hide');
          }
        }
       parent.showCustomScrollbar();
      }
    }).blur(function () {
      $(this).siblings('div.drop-list').removeClass('show');
      $(this).siblings('div.drop-list').addClass('hide');
        if ($('span.clear-btn:hover') && $('span.clear-btn:hover').length > 0) {
        $(this).focus();
      } else {
        $(this).siblings('span.clear-btn').addClass('hide');
      }
    });
    this.isColllapsed=[];
    if(this.counterGroup.counterList){
     for(let counter of this.counterGroup.counterList){
            this.isColllapsed.push(false);
           //formArray.push(this.createItem(counter));
          }
    }
  }

    showCustomScrollbar() {
      $('ul.dropdown-overflow').mCustomScrollbar({
        theme: "minimal-dark",
        advanced: {
          autoScrollOnFocus: false,
          updateOnContentResize: true
        }
      });
    }

   setFormControlValues(fieldvalue, type) {
     if(type.indexOf('.')>0){
      let subType =type.split('.');
      let key = subType[1] ;
       let obj ={};
      obj[subType[1]] = fieldvalue;
    this.addCounterForm.controls[subType[0]].patchValue(obj);
     }else{
      this.addCounterForm.controls[type].setValue(fieldvalue);
     }
  }
  showDropdown(event) {
    let elem: any = $(event.currentTarget).siblings('div.drop-list');
    let elem1: any = $(event.currentTarget).parents('a').siblings('div.drop-list');
    // let elem1: any = $(event.currentTarget).parents('div.form-group').siblings().children('div.dropdown');
    console.log(elem1);
    if (elem && elem.length > 0)
      elem.removeClass('hide').addClass('show');
    if (elem1 && elem1.length > 0)
      elem1.removeClass('hide').addClass('show');
  }

  hideDropdown(event) {
    $(event.currentTarget).siblings('div.drop-list').removeClass('show').addClass('hide');
  }

  getParsedValue(counter,key){
    let counterObj = JSON.parse(JSON.stringify(counter.value));
    let obj={};
    let val= counter.value;
   let keyFormCOntrol = new FormControl(val[key]);
   keyFormCOntrol.disable();
    return keyFormCOntrol.value
  }

  gotoTab(id){
    $('#'+id).click();
    this.getCounterList();
  }

  //   get kpiName() { return this.newKPIForm.get('kpiName'); }
  // get aggregationType() { return this.newKPIForm.get('aggregationType'); }
  // get kpiDescription() { return this.newKPIForm.get('kpiDescription'); }
  // get kpiUnit() { return this.newKPIForm.get('kpiUnit'); }
}
