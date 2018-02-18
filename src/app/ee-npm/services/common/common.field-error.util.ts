import { Injectable, Inject } from '@angular/core';

@Injectable()
export class CommonFieldErrorUtilService{
form:any;

setForm(form){
    this.form = form;
}

isFieldValid(field: string) {
  return !this.form.get(field).valid && (this.form.get(field).touched || this.form.get(field).dirty);
}

displayFieldCss(field: string) {
  return {
    'error-field': this.isFieldValid(field),
    'has-feedback': this.isFieldValid(field)
  };
}

displayDropdownFieldCSS(field: string,array){
  return {
    'error-field': this.displayDropdownError(field,array)
  };
}

isFieldValidWithPattern(field: string){
    return !this.form.get(field).valid && this.form.get(field).pattern &&  this.form.get(field).touched;
}

isFieldEmpty(){

}
displayDropdownError(field,array){
  if(this.form.get(field).touched){
  if(this.form.get(field).valid && this.form.get(field).touched){
    if(!array){
      return false;
    }else if(array.indexOf(this.form.get(field).value)<0){
      return true;
    }else{
      return false;
    }
    
  } else{
    return true;
  }
  }

}

}