import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
declare var $: any;
@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  constructor(private _elementRef: ElementRef) {
  }

  @Output()
  public clickOutside = new EventEmitter();

  @HostListener('document:click', ['$event.target'])

  public onClick(targetElement) {

    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
   //let elem:any =$(this._elementRef.nativeElement).siblings("tags-input").children('div').children('input.tags-input__input-field');
   let elem:any =$(this._elementRef.nativeElement).siblings("div.counter").children('a');
   
   //let elem2 :any = $(this._elementRef.nativeElement).siblings("a").find('span.arw');
   // let currentElemName = $(this._elementRef.nativeElement).siblings('input.form-control')!=undefined ? $(this._elementRef.nativeElement).siblings('input.form-control').attr('name') : "";
   let targetElemName = $(targetElement).attr('name');
   let spanElem:any = $(this._elementRef.nativeElement).siblings("div.counter").find('span.'+targetElemName);
    let closeModal: boolean = false;
     if( !clickedInside && $(elem).attr('name') && $(spanElem).length == 0 && $(elem).attr('name')!=targetElemName){
      closeModal = true;
   
    }



    if (closeModal) {
      $(this._elementRef.nativeElement).removeClass('show').addClass('hide');
    }
  }
}
