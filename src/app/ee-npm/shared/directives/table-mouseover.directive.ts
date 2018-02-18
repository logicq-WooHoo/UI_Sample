import { Directive, ElementRef, HostListener, Input, Renderer } from '@angular/core';

@Directive({
  selector: '[table-mouse-over]'
})
export class TableMouseOverDirective {
  @Input('table-mouse-over') tablemouseover;
  
  constructor(private el: ElementRef, private renderer: Renderer) {
  }
  ngOnChanges() {
   
    if (this.tablemouseover != undefined && this.tablemouseover != null) {
      this.renderer.setElementAttribute(this.el.nativeElement, 'title', this.tablemouseover);
      this.renderer.setElementAttribute(this.el.nativeElement, 'class', 'td-ellipsis');
    }
    
  }
}
