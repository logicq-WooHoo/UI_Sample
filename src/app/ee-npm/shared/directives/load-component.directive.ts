import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[loadComponent]',
})
export class LoadComponentDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}