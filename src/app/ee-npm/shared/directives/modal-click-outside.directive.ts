import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

declare var $:any;
@Directive({
    selector: '[modalClickOutside]'
})
export class ModalClickOutsideDirective {
    constructor(private _elementRef : ElementRef ) {
    }

    @Output()
    public clickOutside = new EventEmitter();
    @Output()  cleardata :EventEmitter<string>= new EventEmitter();
    @HostListener('document:click', ['$event.target'])

    public onClick(targetElement) {

      const clickedInside = this._elementRef.nativeElement.contains(targetElement);
      let spanElem=$(targetElement).parents('li.action-menu-li').find('a');
  let closeModal:boolean =false;
        if (!clickedInside) {
            this.clickOutside.emit(null);
            if(targetElement.localName!='app-report'){
              if(targetElement.parentElement == null){
                closeModal = true;
              }else if(spanElem && spanElem.length >0){
                closeModal = false;
              }
            else if((typeof targetElement.className== 'string' && !targetElement.className.match('ui_') && !targetElement.className.match('ui-'))&& (typeof  targetElement.parentElement.className == 'string' && !targetElement.parentElement.className.match('ui_') &&  !targetElement.parentElement.className.match('ui-'))){
              closeModal = true;
            }else if(typeof targetElement.className== 'object'){
              closeModal = true;
            }
          }
          console.log(closeModal);
        }



    if(closeModal){
         if($(this._elementRef.nativeElement).parents('li').hasClass("active")){
             $(this._elementRef.nativeElement).parents('li').removeClass("active");
         }
         $('.action-menu').find('a.action-menu-tab').removeClass('active');
      $(this._elementRef.nativeElement).fadeOut();
    this.cleardata.emit("true");
    }
  }
}
