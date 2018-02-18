import { Component, OnInit } from '@angular/core';
import { KpiService } from '../services/http/kpi/kpi.service';
import { CommonFieldErrorUtilService } from '../services/common/common.field-error.util';
import { GetreportService } from '../services/http/report/getreport.service';
import { DataLoadSpinner } from '../services/dataLoadSpinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from "@angular/forms";
 import { LocalStorageService} from 'angular-2-local-storage';
declare var $: any;
declare var require: any;

require("../../../assets/js/prism.min.js");
require("../../../assets/js/semantic.ui.min.js");
require("../../../assets/js/pignose-formula.build");

@Component({
  selector: 'app-kpi-creation',
  templateUrl: './kpi-creation.component.html',
  styleUrls: ['./kpi-creation.component.css'],
  providers: [CommonFieldErrorUtilService]
})
export class KpiCreationComponent implements OnInit {

  public elements: any;
  element: any;
  deviceTypeModel: any = { elementUserLabel: "" }
  nodes: any
  countersDisplay = [];
  controlgroup: any;
  counterLoading: any;
  counterGroupsDisplay = [];
  counterIds = [];
  newKPIForm: FormGroup;
  formulaString = "";
  kpiDetails = { displayName: "", aggregationType: "", description: "", kpiUnit: "", id: "", formula: "", counterList: "", counterConfig: [] };
  showSpinner: boolean = false;
  kpiFormModel = { aggregationType: ["SUM", "MIN", "MAX", "AVG"] };
  eventData: any = { data: [], headers: [] };
  kpiList: any;
  editKPI: boolean;
  kpiObjectSelected = {};
  kpiEnableDisableMessage = "";
  selectCounterGroupId: any = 0;
  searchCG:any;
  counterGroupPopUp=[];
  breadcrumbs:any;
  constructor(private getreportService: GetreportService, private formBuilder: FormBuilder, private kpiService: KpiService, private dataLoadSpinner: DataLoadSpinner, public commonFieldErrorUtilService: CommonFieldErrorUtilService, private router: Router, private route: ActivatedRoute,private localStorageService:LocalStorageService) { }

  ngOnInit() {
    this.breadcrumbs={mainlink:"KPI creation",sublinks:[{displayName:'KPI properties'}]}
    this.localStorageService.set('breadcrumbs',this.breadcrumbs);
    this.getreportService.getDevices().subscribe(data => {
      if (data) {
        this.elements = data;
        // this.devices = data;
      }
    });
    if (this.route.snapshot.params && this.route.snapshot.params["id"]) {
      let request = { id: this.route.snapshot.params["id"] };
      this.kpiService.getKPIs(request).subscribe((data) => {
        this.editKPI = true;
        // let kpi = {"id":1,"deviceType":"MME","formula":"(1056974608+1056974609)/1056974611","counterList":"1056974608,1056974609,1056974611","displayName":"Kpi Demo","isActive":true,aggregationType:"SUM",kpiUnit:"times",kpiDescription:""};
        this.kpiDetails = data[0];
        this.selectCounterGroupId = data[0].counterGroupId;
        this.counterIds = data[0].counterList;
        this.element = this.kpiDetails["deviceType"];
        this.selectDeviceType(this.kpiDetails["deviceType"]);
        this.setFormAttributes();
        this.editFormulaBuilder();
        this.dataLoadSpinner.hide();
        this.countersDisplay = this.kpiDetails.counterConfig;
      }, (err) => {
        console.log(err);
      });
    } else {
      this.editKPI = false;
      this.setFormAttributes();
    }
    this.setFormAttributes();

  }

  setFormAttributes(details?) {
    if (!details) {
      details = this.kpiDetails;
    }
    this.newKPIForm = new FormGroup({
      'kpiName': new FormControl(details.displayName, [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern("^[a-zA-Z0-9 ]+$")]),
      'aggregationType': new FormControl(details.aggregationType, [Validators.required]),
      'kpiDescription': new FormControl(details.description, [Validators.required]),
      'kpiUnit': new FormControl(details.unit, [Validators.required])

    });
    this.commonFieldErrorUtilService.setForm(this.newKPIForm);
  }

  ngAfterViewInit() {
    let parent= this;
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
    if (this.editKPI) {
      this.editFormulaBuilder();
    } else {
      this.loadFormulaBuilder();
    }
    this.showCustomScrollbar();
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

  selectDeviceType(device) {
    //this.nodes = device;
    // this.device =  device;
    this.deviceTypeModel = {};
    this.clearAllData();
    this.nodes = [];
    let request = {
      "deviceType": device
    };
    this.element = device;
    this.addJSONParsedModel('ALL');
  }

  clearAllData() {
    this.counterIds = [];
    this.counterGroupsDisplay = [];
    this.countersDisplay = [];
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

  hideDropdownClick(event) {
    $(event.currentTarget).parents('div.drop-list').removeClass('show').addClass('hide');
  }
  addJSONParsedModel(device) {
    let request = {};
    if (device == 'ALL') {
      request = {
        "deviceType": this.element
      }
      this.deviceTypeModel.elementUserLabel = "All Nodes";
    } 


    this.getreportService.getCounterGroups(request).subscribe(data => {
      if (data) {
        this.selectCounterGroupId = 0;
        this.deviceTypeModel.controlgroup = JSON.parse(JSON.stringify(data));
      }

      for (let controlgroup of this.deviceTypeModel.controlgroup) {
        $.extend(controlgroup, { showEnable: false });

      }
    });

    this.controlgroup = "";


    // this.clearAllData();
    $('div#counterGroup').children('tags-input').on('click', (e) => {
      this.showDropdown(e);
    })
  }

  showCountersFromGroup(counterGroup, index, event) {
    let request = {
      "counterGroups": [

      ]
    };
    let arr = [];

    arr.push({ "counterGroupId": counterGroup.counterGroupId });
    request.counterGroups = arr;
    if (!counterGroup.counterList || counterGroup.counterList.length <= 0) {
      this.getreportService.getCounterIDs(request).subscribe(data => {
        if (data) {
          for (let cg of data) {
            if (counterGroup.counterGroupId == cg.counterGroupId) {
              counterGroup.counterList = cg.counterList;
            }
            if (this.editKPI && counterGroup.counterGroupId == this.selectCounterGroupId) {
              for (let counter of counterGroup.counterList) {
                if (this.kpiDetails.counterList.includes(counter.counterId)) { $.extend(counter, { showEnable: true }); }
              }
            }
          }
        }
        setTimeout(()=>{
         this.showCustomScrollbar();
      },0)
      this.counterGroupPopUp = counterGroup;
      });
    }else{
      this.counterGroupPopUp = counterGroup;
    }
    //  $('div[id=counter-group-' + index + ']').on('click', (e) => {
    this.showDropdown(event);
    // });

  }





  addCountersIntoGroup(counterGroup, value) {
    this.counterLoading = true;
    if (value) {
      this.counterGroupsDisplay.push(counterGroup);
    }

    let request = {
      "counterGroups": [

      ]
    };
    let arr = [];

    arr.push({ "counterGroupId": counterGroup.counterGroupId });

    if (value) {
      request.counterGroups = arr;
      if (!counterGroup.counterList || counterGroup.counterList.length <= 0) {
        this.getreportService.getCounterIDs(request).subscribe(data => {
          if (data) {
            for (let cg of data) {
              for (let cgs of this.counterGroupsDisplay) {
                if (cgs.counterGroupId == cg.counterGroupId) {
                  cgs.counterList = cg.counterList;
                }

              }

            }


            for (let counter of counterGroup.counterList) {
              if (this.editKPI && this.selectCounterGroupId == counterGroup.counterGroupId) {
                $.extend(counter, { showEnable: true });
              }
              else {
                $.extend(counter, { showEnable: false });
              }
              // if (!this.counterGroupMap.has(counter.counterId)) {
              //   this.counterGroupMap.set(counter.counterId, counter);
              // }
            }

            this.counterLoading = false;

          }
        });
      }

    }
    //  this.commonGetterSetterService.setCounterNamesMap(this.counterGroupMap);
  
  }
  editFormulaBuilder() {
    //console.log( $('.formula-advanced').children('a.formula-item'));
    $('.formula-advanced').empty();

    // console.log( $('.formula-advanced').children('a.formula-item'));
    let operator = ["(", ")", "*", "/", "+", "-"];
    let elements = "";
    let arrayTodisplay = [];
    let counters = [];
    let formulaMap: Map<any, any> = new Map();

    if (this.kpiDetails.counterConfig != null) {
      counters = this.kpiDetails.counterConfig;
    }

    this.loadFormulaBuilder();
    if ($('.formula-advanced').find("p.blank-msg") && $('.formula-advanced').find("p.blank-msg").length > 0) {
      $('.formula-advanced').find("p.blank-msg").remove();
    }


    let formula = this.kpiDetails.formula;
    for (let oper of operator) {
      formulaMap.set(oper, "<a class='formulaitem' datavalue='" + oper + "'><$a>");
    }

    for (let counter of counters) {
      formulaMap.set(counter, "<a class='formulaitem' datavalue='" + counter.counterId + "'><$a>");
    }
    formulaMap.forEach((value, key) => {
      if (formula.indexOf(key) >= 0) {
        let reg: any;

        let exp = '[' + key + ']';
        reg = new RegExp(exp, 'g');
        if (key.length > 1) {
          reg = new RegExp(key, 'g');
        }

        formula = formula.replace(reg, value);
      }
    });
    formula = formula.replace(new RegExp('[$]', 'g'), '/');
    formula = formula.replace(new RegExp('formulaitem', 'g'), 'formula-item-dummy');
    formula = formula.replace(new RegExp('datavalue', 'g'), 'data-value');
    if ($('.formula-advanced').find("p.blank-msg") && $('.formula-advanced').find("p.blank-msg").length > 0) {
      $('.formula-advanced').find("p.blank-msg").remove();
    }
    $('.formula-advanced').append(formula);
    this.loadFormulaBuilder();
    //console.log($('.formula-advanced').children('.formula-item-dummy'));

    // if($('.formula-advanced').childNodes && $('.formula-advanced').childNodes =="text"){
    // console.log($('.formula-advanced').childNodes["text"]);
    //}
    console.log($('.formula-advanced'));
    let elem = $(($('.formula-advanced'))[0]["childNodes"]);


    elem.each(function (i, element) {
      if (element.nodeName && element.nodeName != "A") {
        $(element).replaceWith('<a data-value="' + $(element).text() + '" class="formula-item-dummy"></a>');
      }
    });
    console.log($('.formula-advanced'));
    let array = (($('.formula-advanced').children('.formula-item-dummy')));
    array.each(function (i, element) {
      for (let counter of counters) {
        if (counter.counterId == $(element).attr('data-value') && !operator.includes($(element).attr('data-value'))) {
          $(element).append(counter.displayName);
        }
      }
      if (operator.includes($(element).attr('data-value'))) {
        $(element).append($(element).attr('data-value'));
      }
      $(element).addClass('formula-item formula-custom').removeClass('.formula-item-dummy');

    });

  }

  loadFormulaBuilder() {
    var $formula = $('.formula').formula({ cursorAnimTime: 200 });

    // You can load formula expression by wrting JSON type value;
    var data = { "operator": "+", "operand1": { "operator": "+", "operand1": { "value": "1", "type": "unit" }, "operand2": { "value": "2", "type": "unit" } }, "operand2": { "value": "3", "type": "unit" } };

    // .setFormula({:data}) can load new expression.
    //$formula.first().formula('setFormula', data);

    // .draggable is normal jQuery UI plugin. It support to dragging the element by using mouse click and move.
    // $('.formula-drop .formula-drop-items .formula-custom').draggable({
    // 	revert: 'invalid',
    // 	helper: 'clone',
    // 	cancel: '',
    // 	scroll: false
    // });

    let parent = this;

    // .droppable can detect drop event of draggable element.
    $('.formula-advanced').droppable({
      classes: {
        "ui-droppable": "highlight"
      },

      drop: function (event, ui) {

        let x, y;
        // You can clone drop item to move inside formula.

        var $element = ui.draggable.clone();

        if ($($element).children("i") && $($element).children("i").length >= 0) {
          $($element).children("i").remove();
        }
        let counter = parent.countersDisplay.filter((counter) => {
          return counter.displayName === $($element).text().trim();
        })
        let count = counter[0] ? counter[0] : {};
        let counterName = count["counterId"] ? count["counterId"] : $($element).text().trim();
        $($element).attr("data-value", counterName);
        if ($(this).find("p.blank-msg") && $(this).find("p.blank-msg").length > 0) {
          $(this).find("p.blank-msg").remove();
        }


        if ($(this).children(".formula-cursor").position()) {
          x = $(this).find(".formula-cursor").position().left;
          //console.log("Inside cursor");
          y = $(this).find(".formula-cursor").position().top;
          // console.log($(this).find(".formula-cursor").position());
        } else if ($(this).find(".formula-item").last() && $(this).find(".formula-item").last().position()) {
          if ($(this).find(".formula-item").length > 4) {
            x = $(this).find(".formula-item").last().position().left + 200;
            y = $(this).find(".formula-item").last().position().top + 100;
          } else {
            x = $(this).find(".formula-item").last().position().left + 500;
            y = $(this).find(".formula-item").last().position().top;
          }

          // console.log($(this).find(".formula-item").last());
        } else {
          x = event.offsetX;
          y = event.offsetY;
        }
        // Position variable describes `where` you put the element.


        var position = {
          x: x,
          y: y
        };
        // 'insert' command can put the element at some position.
        $(this).formula('insert', $element, position);

      }
    });



    $('.formula-advanced').bind('formula.input', function (event, data) {
      console.log('input', data);
    });
  }


  public counterChanged(val) {
    if (val.change == 'remove') {
      this.addCounterIds(val.tag, false, null);
    }
  }


  addCounterIds(counter, value, counterGroup) {
    this.selectCounterGroupId = counterGroup.counterGroupId;
    if (this.counterIds.indexOf(counter.counterId) < 0 && value) {
      this.counterIds.push(counter.counterId);
    } else if (this.counterIds.indexOf(counter.counterId) >= 0 && !value) {
      this.counterIds.splice(this.counterIds.indexOf(counter.counterId), 1);
    }

    if (value) {
      this.countersDisplay.push(counter);
    } else {
      counter["showEnable"] = false;
      let i = 0;
      for (let coutr of this.countersDisplay) {
        if (coutr.counterId == counter.counterId) {
          this.countersDisplay.splice(i, 1);
        }
        i++;
      }
    }
    if (this.countersDisplay != null && this.countersDisplay.length == 0) {
      this.selectCounterGroupId = 0;
      $('.formula-advanced').empty();
    }

    setInterval(() => {
      $('.formula-drop-items a.formula-custom').each(function (i, elem) {

        $(elem).draggable({
          revert: 'invalid',
          helper: 'clone',
          cancel: '',
          scroll: false
        })
      });
    }, 0)

  }

  setFormControlValues(fieldvalue, type) {
    this.newKPIForm.controls[type].setValue(fieldvalue);
  }

  getFormulaString() {
    let str = "";
    $('.formula-advanced').formula('getFormula', function (data) {
      for (let form of data.data) {
        if (typeof form == "object") {
          str += form.value;
        } else {
          str += form;
        }

      }
    });

    return str;

  }

  checkFormValidation() {
    // let str= this.getFormulaString();
    if (!this.newKPIForm.valid && this.editKPI) {
      return true;
    } else if (!this.newKPIForm.valid) {
      return true;
    }
  }

  addDisabledClassValidateForm(){
    if(this.checkFormValidation()){
       return {'disabled' : true}
    }else{
      return {'disabled' : false}
    }
    
  }

  createKPI($event) {

    let request = { deviceType: "", formula: "", counterList: "", displayName: "", isActive: true, unit: "", description: "", aggregationType: "", counterGroupId: "" };
    request.deviceType = this.element;
    this.formulaString = this.getFormulaString();
    var parent = this;
    let formString = "";
    request.unit = this.newKPIForm.get('kpiUnit').value;
    request.aggregationType = this.newKPIForm.get('aggregationType').value;
    request.description = this.newKPIForm.get('kpiDescription').value;
    request.formula = this.formulaString;
    let counterString = "";
    for (let counter of this.countersDisplay) {
      if (parent.formulaString.length > 0 && parent.formulaString.indexOf(counter.counterId) >= 0) {
        counterString += counter.counterId + ",";
      }
    }
    counterString = counterString.slice(0, -1);
    request.counterList = counterString;
    request.displayName = this.newKPIForm.get('kpiName').value;
    if (!this.newKPIForm.valid || request.formula.length == 0) {
      return true;
    }
    request.counterGroupId = this.selectCounterGroupId;
    this.dataLoadSpinner.setSpinnerButton($($event.currentTarget).children('i'));
    this.kpiService.createKPI(request).subscribe(data => {
      if (data["_body"] && data["_body"].indexOf('Duplicate') >= 0) {
        this.dataLoadSpinner.showErrorMessage("Please check KPI properties . Either name or formula is duplicate");
      } else {
        this.dataLoadSpinner.showSuccessMessage("New KPI created");
        this.selectCounterGroupId = 0;
        this.setFormAttributes();
        this.clearAllData();
        this.deviceTypeModel = {};
        $('.formula-advanced').empty();
        $("#kpiListAnchor").click();
        this.getAllKPIs();

    }}, (err) => {
      console.log(err);
    });
  }

  get kpiName() { return this.newKPIForm.get('kpiName'); }
  get aggregationType() { return this.newKPIForm.get('aggregationType'); }
  get kpiDescription() { return this.newKPIForm.get('kpiDescription'); }
  get kpiUnit() { return this.newKPIForm.get('kpiUnit'); }

  insertElement(event) {
    let $element = $(event.currentTarget).clone();
    let x, y;
    if ($('.formula-advanced').find(".formula-item").last() && $('.formula-advanced').find(".formula-item").last().position()) {
      if ($('.formula-advanced').find(".formula-item").length > 4) {
        x = $('.formula-advanced').find(".formula-item").last().position().left + 200;
        y = $('.formula-advanced').find(".formula-item").last().position().top + 300;
      } else {
        x = $('.formula-advanced').find(".formula-item").last().position().left + 500;
        y = $('.formula-advanced').find(".formula-item").last().position().top;
      }
    } else {
      x = event.offsetX;
      y = event.offsetY;
    }
    let position = {
      x: x,
      y: y
    };
    $('.formula-advanced').formula('insert', $element, position);

  }

  getAllKPIs() {
    let request = { "deviceType": "ALL" };
    this.eventData = { data: [], headers: [] };
    this.kpiService.getKPIs(request).subscribe((data) => {
      if (data && data.length > 0) {
        this.kpiList = data;
        this.kpiList.forEach((e) => {
          e["link"] = e.id;
          if (e.counterConfig != null && e.counterConfig.length > 0) {
            e.counterConfig.forEach((counter) => {
              
              if (e.formula.indexOf(counter.counterId) != -1) {
                e.formula =e.formula.replace(counter.counterId, " "+counter.displayName+" ");
             
              }
            });
          }
          console.log(e.formula);
          this.eventData.data.push(e);
        });

      }
      this.eventData.headers = [{ displayName: 'Device', id: "deviceType" }, { displayName: 'Name', id: "displayName" }, { displayName: 'Formula', id: "formula" }, { displayName: 'Enabled', id: "isActive" }, { displayName: '', id: "Edit", link: "link" }];
    }, (err) => {
      console.log(err);
    });
    this.setBreadcrumbs('KPI List');
  }

  saveKPI($event) {
    let request = { id: this.kpiDetails.id, deviceType: this.element, formula: "", counterList: "", displayName: this.kpiDetails.displayName, isActive: true, unit: this.newKPIForm.get('kpiUnit').value, description: this.newKPIForm.get('kpiDescription').value, aggregationType: this.newKPIForm.get('aggregationType').value, counterGroupId: this.selectCounterGroupId };
    request.deviceType = this.element;
    this.formulaString = this.getFormulaString();
    var parent = this;
    let formString = "";

    request.formula = this.formulaString;
    let counterString = "";
    for (let counter of this.countersDisplay) {
      console.log(parent.formulaString.indexOf(counter.counterId));
      if (parent.formulaString.length > 0 && parent.formulaString.indexOf(counter.counterId) >= 0 && counterString.indexOf(counter.counterId) < 0) {
        counterString += counter.counterId + ",";
      }
    }
    counterString = counterString.slice(0, -1);
    request.counterList = counterString;
    if (!this.newKPIForm.valid || request.formula.length == 0) {
      this.dataLoadSpinner.showErrorMessage("Please enter all valid data");
      return true;
    }
    this.dataLoadSpinner.setSpinnerButton($($event.currentTarget).children('i'));
    this.kpiService.updateKPI(request).subscribe(data => {
      if (data["_body"] && data["_body"].indexOf('Duplicate') >= 0) {
        this.dataLoadSpinner.showErrorMessage("Please check KPI properties . Either name or formula is duplicate");
        this.router.navigate(['/kpiCreation']);
      } else {
        this.dataLoadSpinner.showSuccessMessage("KPI saved");
        this.router.navigate(['/kpiCreation']);
      }

      console.log(data);
    }, (err) => {
      console.log(err);
    });
  }

  selectedKpiId(object) {
    this.kpiEnableDisableMessage = "";
    this.kpiObjectSelected = object;
    if (this.kpiObjectSelected["isActive"]) {
      this.kpiEnableDisableMessage = "Do u want to disable this kpi ?";
    } else {
      this.kpiEnableDisableMessage = "Do u want to enable this kpi ?";
    }
  }

  changeKPI() {
    let request = this.kpiObjectSelected;
    this.eventData = { data: [], headers: [] };
    request["isActive"] = request["isActive"] ? false : true;
    this.dataLoadSpinner.showProgressMessage("Please wait KPI is being updated");
    this.kpiService.updateKPI(request).subscribe(data => {
      this.dataLoadSpinner.showSuccessMessage("KPI saved");
      console.log(data);
      this.getAllKPIs();
    }, (err) => {
      console.log(err);
      this.getAllKPIs();
    });



  }
  removeCounter(counter){
    this.countersDisplay = this.countersDisplay.filter((c)=>{
      return c.counterId != counter.counterId
    })

    cgloop:
    for(let cg of this.deviceTypeModel.controlgroup){
      if(cg.counterGroupId == this.selectCounterGroupId){
        for(let count of cg.counterList){
          if(counter.counterId == count.counterId){
            counter["showEnable"] = false;
            break cgloop;
          }
        }
      }
    }
     if (this.countersDisplay != null && this.countersDisplay.length == 0) {
      this.selectCounterGroupId = 0;
    }
    $('.formula-advanced').empty();
  }

  gotoKPIGeneration(id){
    $('#'+id).click();
    if(id=="kpiListAnchor"){
      this.getAllKPIs();
    }
  }

  setBreadcrumbs(crumbs){
     this.breadcrumbs={mainlink:"KPI creation",sublinks:[{displayName:crumbs}]}
  }
}
