import { Component, OnInit, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonFieldErrorUtilService } from '../services/common/common.field-error.util';
import { FormGroup,FormArray, FormControl, FormBuilder, Validators, AbstractControl } from "@angular/forms";
import { trigger, state, style, animate, transition } from  '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { DataLoadSpinner } from '../services/dataLoadSpinner.service';
import { SchedularService } from '../services/http/schedular/schedular.service';
import { CommonFieldArrayErrorUtilService } from '../services/common/common.array-field-error.util';
declare var $: any;


@Component({
  selector: 'app-schedular',
  templateUrl: './schedular.component.html',
  styleUrls: ['./schedular.component.css'],
  providers: [CommonFieldErrorUtilService, SchedularService,CommonFieldArrayErrorUtilService],
  animations: [
    trigger('collapseAnimation', [
      state('true', style({ overflow:  'hidden', height:  '70px', opacity: '0', border: '1px solid #ddd' })),
      state('false', style({ overflow:  'visible', height:  '*', opacity: '1' })),
      transition('false => true', animate('400ms')),
      transition('true => false', animate('400ms'))
    ]),
    trigger('headingAnimation', [
      state('false', style({ padding: '4px 10px' })),
      state('true', style({})),
      transition('true <=> false', animate('400ms')),
      transition('false => true', animate('400ms'))
    ])
  ],
})
export class SchedularComponent implements OnInit, AfterViewInit {
  @Input()
  reportId: any = "";
  @Input()
  resetForm: any;
  @Input()
  displayScheduledReports: boolean = false;
  taskName: any = "";
  scheduleTypeList: Array<any> = [];
  hourOptions: Array<any> = [];
  scheduledType: any;
  schedularForm: FormGroup;
  showActive = "scheduling";
  dataList = [];
  scheduledReportList = [];
  headerList: Array<any> = [];
  shedularDetails = { Name: "", scheduleType: "", hourValue: "", toValue: "", ccValue: "", subjectValue: "", fileType: "" };
  shedularFormModel = { scheduleTypeList: ["Daily", "Weekly", "Monthly"], hourOptions: ["24 Hours", "12 Hours", "6 Hours", "4 Hours"], FileTypeList: ["CSV", "PDF"] };
  displaySave: boolean = false;
  deleteTaskData: any;
  deleteTaskIndex:any;
  scheduledReportsFormArray:FormArray;
  scheduledReportsFormParent :FormGroup;
  constructor(private formBuilder: FormBuilder, private commonFieldErrorUtilService: CommonFieldErrorUtilService, public schedularService: SchedularService, public localStorageService: LocalStorageService, public dataLoadSpinner: DataLoadSpinner,private commonFieldArrayErrorUtilService : CommonFieldArrayErrorUtilService) {
    this.schedularForm = new FormGroup({
      'Name': new FormControl(this.shedularDetails.Name, [
        Validators.required]),
      'scheduleType': new FormControl(this.shedularDetails.scheduleType, [Validators.required]),
      'hourValue': new FormControl(this.shedularDetails.hourValue,[Validators.required]),
      'toValue': new FormControl(this.shedularDetails.toValue),
      'ccValue': new FormControl(this.shedularDetails.ccValue),
      'subjectValue': new FormControl(this.shedularDetails.subjectValue),
      'fileType': new FormControl(this.shedularDetails.fileType, [Validators.required])

    });
    this.commonFieldErrorUtilService.setForm(this.schedularForm);
    this.scheduledReportsFormParent = this.formBuilder.group({
      'reports':this.scheduledReportsFormArray
    })
  }

  ngOnInit() {
      this.clearFormData();
  }


setFormValue(control,key,state,innerKey?){
 
    let obj={};
    let val = state;
    if(state=='toggle'){
       val=!control.get(key).value;
    }
   
    if(innerKey){
      let obj1={};
      obj1[innerKey]=val;
      obj[key]=obj1;
    }else{
       obj[key]=val;
    }
    control.patchValue(obj);
}


  ngAfterViewInit() {
    $('.dropdown').on({
      focus: function () {
        $(this).siblings('div.drop-list').removeClass('hide');
        $(this).siblings('div.drop-list').addClass('show');
        if ($(this).parents('div.form-group').siblings().children('div.dropdown').length > 0) {
          if ($(this).parents('div.form-group').siblings().children('div.dropdown').find('div.drop-list').hasClass('show')) {
            $(this).parents('div.form-group').siblings().children('div.dropdown').find('div.drop-list').removeClass('show');
            $(this).parents('div.form-group').siblings().children('div.dropdown').find('div.drop-list').addClass('hide');
          }
        }
      }
    }).blur(function () {
      $(this).siblings('div.drop-list').removeClass('show');
      $(this).siblings('div.drop-list').addClass('hide');
    });
    this.schedularForm.controls['scheduleType'].valueChanges
      .subscribe((form: any) => {
        if (this.schedularForm.controls['scheduleType'].value == 'Daily') {
          this.schedularForm.get('hourValue').setValidators([Validators.required]);
        }
        else { this.schedularForm.get('hourValue').setValidators([]); }
        this.schedularForm.get('hourValue').updateValueAndValidity();
      });
   
   

     
  }
  CancelSchedule(event) {
    $(event.currentTarget).parents(".schedule-report").parents("app-schedular").siblings().find('li.active').removeClass('active');
    $(".tabHolder").fadeOut();
  }

  scheduleReport($event) {

    let request = {
      "taskName": this.schedularForm.controls["Name"].value,
      "taskType": this.schedularForm.controls["scheduleType"].value,
      "userTemplateId": this.reportId,
      "taskParamValue": {
        "fileType": this.schedularForm.controls["fileType"].value,
        "userName": this.localStorageService.get("userName"),
        "scheduledReport": true,
        "email": {
          "to": this.schedularForm.controls["toValue"].value,
          "cc": this.schedularForm.controls["ccValue"].value,
          "subject": this.schedularForm.controls["subjectValue"].value

        }
      }
    };

    if (this.schedularForm.get("scheduleType").value == 'Daily') {
      request["dailytaskHourfrequency"] = this.schedularForm.controls["hourValue"].value;
    }
    this.dataLoadSpinner.setSpinnerButton($($event.currentTarget).children('i'));
    this.schedularService.scheduleReport(request).subscribe(data => {
       this.dataLoadSpinner.showSuccessMessage("Report is scheduled successfully.");

      $(".tabHolder").fadeOut();
      $('div.fixed-action').find('a.action-menu-tab').removeClass('active');
    }, (err) => {
   
      this.dataLoadSpinner.showErrorMessage(err);
    });
  }

  clearFormData() {
    this.schedularForm.reset();
   }

  ngOnChanges(changes: SimpleChanges) {
  
    if (this.displayScheduledReports) {
      this.getScheduledReports();
    }
    if (changes['resetForm'] && (changes['resetForm'].currentValue == changes['resetForm'].previousValue || changes['resetForm'].isFirstChange)) {
      this.clearFormData();
    }

  }

  getScheduledReports() {
    this.headerList = [
      { name: "taskName", displayName: "Name" },
      { name: "taskType", displayName: " TYPE " },
      { name: "fileType", displayName: "File Type" },
      { name: "to", displayName: "To" },
      { name: "cc", displayName: " Cc" },
      { name: "subject", displayName: "subject" }


    ];
    let username = this.localStorageService.get("userName");
    this.dataLoadSpinner.show();
    this.schedularService.getScheduledReports(username).subscribe(data => {
      this.dataLoadSpinner.show();
      this.dataList = [];

      data.forEach(element => {
        $.extend(element, { displaySaveIcon: false, isCollapsed: true, isEditable: false });

      });
      this.dataList = data;
      this.scheduledReportList = Object.assign({}, data);
      this.dataLoadSpinner.hide();

      let formArray=[];
          for(let items of this.dataList){
           formArray.push(this.createItem(items));
          }

          this.scheduledReportsFormArray =this.formBuilder.array(formArray);
          this.scheduledReportsFormParent.controls["reports"] = this.scheduledReportsFormArray;
          this.commonFieldArrayErrorUtilService.setForm(this.scheduledReportsFormParent);
          console.log(this.scheduledReportsFormParent);
         for(let control of this.reportsArray.controls){
           let contr:any = control.get('isEditable');
         contr.valueChanges.subscribe((data)=>{
         if(data){
              control.get('taskName').enable();
              control.get('taskType').enable();
              control.get('dailytaskHourfrequency').enable();
              control.get('taskParamValue.fileType').enable();
              control.get('taskParamValue.email.to').enable();
              control.get('taskParamValue.email.cc').enable();
              control.get('taskParamValue.email.subject').enable();
          
            }
         })
         }

    });
  }

  public get reportsArray(): FormArray {
    return this.scheduledReportsFormParent.controls["reports"] as FormArray
  }

createItem(item): FormGroup {
//   let obj={};
//   taskName
// taskParamValue.fileType
// taskType
// dailytaskHourfrequency
//   for(let key in item){
//     obj={};
//     if(key =="displaySaveIcon" || key=="isCollapsed" ||  key=="isEditable"){
//     obj[key] = new FormControl(item[key]);
//     }else{
//       obj[key] = new FormControl(item[key], [Validators.required]);
//     }
//   }
  return this.formBuilder.group({
    'taskName': new FormControl({value :item.taskName, disabled:true}, [Validators.required]),
    'taskType': new FormControl({value:item.taskType, disabled:true}, [Validators.required]),
    'taskId': new FormControl(item.taskId, [Validators.required]),
    'dailytaskHourfrequency': new FormControl({value:item.dailytaskHourfrequency, disabled:true}, [Validators.required]),
    'taskParamValue':new FormGroup({
      "fileType":new FormControl({value:item.taskParamValue.fileType , disabled:true}),
      "email":new FormGroup({
        "to":new FormControl({value:item.taskParamValue.email.to , disabled:true}),
        "cc":new FormControl({value:item.taskParamValue.email.cc,disabled:true}),
        "subject":new FormControl({value:item.taskParamValue.email.subject, disabled:true})
      })
      }),
      "displaySaveIcon":new FormControl(item.displaySaveIcon),
      "isCollapsed":new FormControl(item.isCollapsed),
      "isEditable":new FormControl(item.isEditable),
      })
  
  
}


  deleteTask() {
    if (this.deleteTaskData) {

     
     this.schedularService.deleteTask(this.deleteTaskData.get('taskId').value).subscribe(data => {
        this.dataLoadSpinner.showSuccessMessage("Report " + this.deleteTaskData.get('taskName').value + " is deleted successfully.");
        this.reportsArray.removeAt(this.deleteTaskIndex);

      }, (err) => {
   
        this.dataLoadSpinner.showErrorMessage(err);
      });
    }
  }
  showDropdown(event) {
    let elem: any = $(event.currentTarget).siblings('div.drop-list');
    let elem1: any = $(event.currentTarget).parents('a').siblings('div.drop-list');
 
    if (elem && elem.length > 0)
      elem.removeClass('hide').addClass('show');
    if (elem1 && elem1.length > 0)
      elem1.removeClass('hide').addClass('show');
  }

  hideDropdown(event) {
    $(event.currentTarget).siblings('div.drop-list').removeClass('show').addClass('hide');
  }

  updateScheduleTask(taskData, index) {
  //   let request = {
  //     'taskName': taskData.get('taskName').value,
  //   'taskType': taskData.get('taskType').value,
  //   'taskId':taskData.get('taskId').value,
  //  'dailytaskHourfrequency':taskData.get('dailytaskHourfrequency').value,
  //   'taskParamValue':{
  //     "fileType":taskData.get('taskParamValue.fileType').value,
  //     "email":{
  //       "to":taskData.get('taskParamValue.email.to').value,
  //       "cc":taskData.get('taskParamValue.email.cc').value,
  //       "subject":taskData.get('taskParamValue.email.subject').value
  //     }
  //   }
  // }
  let Report =  this.dataList.filter((report)=> 
  report.taskId == taskData.get('taskId').value
  );

  let scheduledReport = Report[0];
  scheduledReport['taskName'] = taskData.get('taskName').value;
  scheduledReport['taskType'] = taskData.get('taskType').value;
  scheduledReport['dailytaskHourfrequency'] = taskData.get('dailytaskHourfrequency').value;
  scheduledReport['taskParamValue']['fileType']= taskData.get('taskParamValue.fileType').value;
  scheduledReport['taskParamValue']['email'] = {
        "to":taskData.get('taskParamValue.email.to').value,
        "cc":taskData.get('taskParamValue.email.cc').value,
        "subject":taskData.get('taskParamValue.email.subject').value
      };

    this.dataLoadSpinner.show();
    this.schedularService.updateScheduleTask(scheduledReport).subscribe(data => {
      this.dataLoadSpinner.showSuccessMessage("Report " + taskData.get('taskName').value + " is updated successfully.");
     $('a#anchor'+taskData.get('taskId').value).click();
     this.setFormValue(taskData,'isCollapsed','toggle')
    }
      , (err) => {
          this.dataLoadSpinner.showErrorMessage(err);
      });;
  }

  setDisplaySaveIcon(oldvalue, newvalue, data) {
    if (!data.value.displaySaveIcon) {
      if (oldvalue != newvalue) {
       // data.value.displaySaveIcon = true;
       this.setFormValue(data,'displaySaveIcon',true);
      } else {
        //data.displaySaveIcon = false;
        this.setFormValue(data,'displaySaveIcon',false);
      }
    }
  }

  get Name() { return this.schedularForm.get('Name'); }
  get scheduleType() { return this.schedularForm.get('scheduleType'); }
  get hourValue() { return this.schedularForm.get('hourValue'); }
  get fileType() { return this.schedularForm.get('fileType'); }
  get toValue() { return this.schedularForm.get('toValue'); }


  checkFormValidation() {

    if (!this.schedularForm.valid) {
      return true;
    }
  }

  setDeletedTask(task, index) {
    this.deleteTaskData = task;
    this.deleteTaskIndex=index;
  }

}
