import { Pipe, PipeTransform } from '@angular/core';
import {AppConfig} from '../../../configurations/app.config';
import { CommonParsingService } from '../../services/common/common.parsing.service';
@Pipe({ name: 'customdate', pure: true })
export class CustomDate implements PipeTransform {
    constructor( private appconfig :AppConfig , private commonParsingService :CommonParsingService ){}
    transform(input: any, format : string , timezone : string): any {
        if(input !=undefined && !isNaN(Date.parse(input))){
           return this.commonParsingService.formatDate(input,undefined) +' hrs';
        }
    }
}