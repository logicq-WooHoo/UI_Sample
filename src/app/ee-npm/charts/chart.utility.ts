
import { Type } from '@angular/core';


export interface ChartComponentInt {
  data: any;
  menuToggle:any;
  refreshedData :any;
  type:any;
  index:number;
  height:any;
}



export class ChartIndividualComponent {
  constructor(public component: Type<any>, public data: any,public menuToggle:any , public refreshedData :any, public type:any, public index :number,public height:any) {}
}
