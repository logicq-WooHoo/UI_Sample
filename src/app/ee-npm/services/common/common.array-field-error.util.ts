import { Injectable, Inject } from '@angular/core';
import { FormGroup,FormArray, FormControl, FormBuilder, Validators, AbstractControl } from "@angular/forms";
@Injectable()
export class CommonFieldArrayErrorUtilService{
form:any;

setForm(form){
    this.form = form;
}

isFieldValid(field: string,index?,arrayname?) {
  let formcontrol = this.form.controls[arrayname].controls[index].get(field);
 // console.log(this.form.controls[arrayname].controls[index].get(field));
  return !formcontrol.valid && (formcontrol.touched || formcontrol.dirty);
}

displayFieldCss(field: string,index?,arrayname?) {
  return {
    'error-field': this.isFieldValid(field,index,arrayname),
    'has-feedback': this.isFieldValid(field,index,arrayname)
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

isForminValid(index,arrayname){
  let arr = this.counterFormArray(arrayname).at(index);
  let value =false;

  for (let key in arr["controls"]){
   if(!arr.get(key).valid){
      value= true;
      break;
   }
  }
  return value;
}

public  counterFormArray(arrayname) : FormArray {
    return this.form.controls[arrayname] as FormArray
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