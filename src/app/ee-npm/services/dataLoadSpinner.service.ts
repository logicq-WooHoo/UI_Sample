import {Injectable} from '@angular/core';
declare var $:any;

@Injectable()
export class DataLoadSpinner {

  private _selector:string = 'preloader';
  private _errorSelector : string ="toast-container";
  private _element:HTMLElement;
  public error_message: any;
  public _spinnerButton:any;

  constructor() {
    this._element = document.getElementById(this._selector);
  }

  public show():void {
  //  if(this._element!=null){
  //  this._element.style['display'] = 'block';
console.log($("#"+this._selector));
  if($("#"+this._selector).children() && $("#"+this._selector).children().length==0)
   $("#"+this._selector).append("<div></div>");
   $("#"+this._selector).addClass("preloader");
  //}
  }

  public hide():void {
  //  setTimeout(() => {
    //  if(this._element!=null){
    //  this._element.style['display'] = 'none';
     $("#"+this._selector).children().remove("div");
    $("#"+this._selector).removeClass("preloader");
        $("#"+this._errorSelector).addClass("hide");
  //  }
//}, 0);
  }

  public showErrorMessage(message):void{
  (message!=undefined) ?  this.error_message = message : this.error_message='Something went wrong !!!';
    $("#"+this._errorSelector).addClass("show");
    $("#"+this._errorSelector).removeClass("hide");
$("#"+this._errorSelector).children().addClass("toast-error");
    $("#errorMessage").text(this.error_message);

    setTimeout(()=>{
    $("#"+this._errorSelector).removeClass("show");
        $("#"+this._errorSelector).addClass("hide");
        $("#"+this._errorSelector).children('div').removeClass("toast-error");
        $("#errorMessage").text("");
    },2000);

    this.hide();

  }

  showSuccessMessage(message){
    $("#"+this._errorSelector).addClass("show");
    $("#"+this._errorSelector).removeClass("hide");
$("#"+this._errorSelector).children('div').addClass("toast-success");
    $("#successMessage").text(message);
    setTimeout(()=>{
    $("#"+this._errorSelector).removeClass("show");
        $("#"+this._errorSelector).addClass("hide");
          $("#"+this._errorSelector).children('div').removeClass("toast-success");
            $("#successMessage").text("");
    },4000);

  }

showProgressMessage(message){
    $("#"+this._errorSelector).addClass("show");
    $("#"+this._errorSelector).removeClass("hide");
$("#"+this._errorSelector).children('div').addClass("toast-info");
    $("#successMessage").text(message);
    setTimeout(()=>{
    $("#"+this._errorSelector).removeClass("show");
        $("#"+this._errorSelector).addClass("hide");
          $("#"+this._errorSelector).children('div').removeClass("toast-info");
            $("#successMessage").text("");
    },4000);

  }

  setSpinnerButton(target){
    this._spinnerButton = $(target);
    $(target).css('display','block');
  }

  removeSpinnerButton(){
    if($(this._spinnerButton).length>0){
      $(this._spinnerButton).css('display','none');
    }
    this._spinnerButton = undefined;
  }


}
