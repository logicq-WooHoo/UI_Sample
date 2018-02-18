import { Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from "@angular/forms";

@Pipe({
  name: 'searchpipe'
})
export class SearchPipe implements PipeTransform {

  transform(data: any, args: string, args2: any[] , args3? : string): any {
    let filteredData = data;
    let tempArray: Array<any> = [];
    let reg= new RegExp('[&*$%^#?\;]','g');
    if (args != undefined && args.length > 0 && Array.isArray(data) && !reg.test(args)) {
      filteredData.forEach((item: any) => {
        let flag = false;
        if (args2 != undefined && Array.isArray(args2)) {
          args2.forEach((column) => {
            if(!args3){
              args3 ="name";
            }

           if( item instanceof FormGroup){
             if(item.get(column) && item.get(column).value && item.get(column).value.toLowerCase().match(args)){
              flag = true;
             }
           }
             if (item[column]  &&  typeof item[column][args3] == "string") {
              if (item[column][args3].match(args) || item[column][args3].toLowerCase().match(args.toLowerCase())) {
                flag = true;
              }
            }
          
            if (column[args3]  &&  typeof item[column[args3]] == "string") {
              if (item[column[args3].trim()].match(args) || item[column[args3].trim()].toLowerCase().match(args.toLowerCase())) {
                flag = true;
              }
            }
            if (column[args3]  &&  typeof item[column[args3]] == "number") {
              if (item[column[args3]].toString().match(args)) {
               flag = true;
              }
            }

            else if (column[args3] == undefined && typeof item[column] == "string") {
              if (item[column].match(args) || item[column].toLowerCase().match(args.toLowerCase())) {
                              flag = true;
              }
            }
          });
        } else {
          if (item.name != undefined && item.name.toLowerCase().match(args.toLowerCase())) {
            flag = true;
          }
          else if(item != undefined && item.toLowerCase().match(args.toLowerCase())){
            flag = true;
          }
        }

        if (flag) {
          tempArray.push(item);
        }
      });
      filteredData = tempArray;
    }
    return filteredData;
  }
}
