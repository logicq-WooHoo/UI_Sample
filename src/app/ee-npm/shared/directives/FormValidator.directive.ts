import { Directive, ElementRef, Output, EventEmitter, Input } from '@angular/core';
declare var $: any;
@Directive({
  selector: '[form-validator]'
})
export class FormValidatorDirective {
  @Input('form-validator') value1;
  @Input('validate') isValidate;
  @Input('element-id') elementId;
  @Input('array-length') length;
  @Output() isFormValid = new EventEmitter<any>();


  constructor(private _elementRef: ElementRef) {
  }

  ngOnChanges() {
    this.hasError();
  }

  public hasError() {
    let error: boolean = true;
    if (this.isValidate) {
      if (typeof this.value1 === "string") {
        this.value1 = this.value1.trim();
      }
      if ((!this.value1 || this.value1 == '')) {
        $(this._elementRef.nativeElement).siblings('span.add-error').addClass('error-text show');
        $(this._elementRef.nativeElement).addClass("error-field");
        $(this._elementRef.nativeElement).siblings('span.add-error').children('span').text(' is required.');
        error = true;

      }
      else {
        $(this._elementRef.nativeElement).siblings('span.add-error').removeClass('error-text show').addClass('hide');
        $(this._elementRef.nativeElement).removeClass("error-field");
        error = false;
      }

    }

    let emitobject = {
      key: this.elementId,
      value: error
    }

    this.isFormValid.emit(emitobject);
    return error;
  }
}
