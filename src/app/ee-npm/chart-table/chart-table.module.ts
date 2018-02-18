import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ChartsModule } from '../charts/charts.module';
import {SharedModule} from '../shared/shared.module';
import { ChartTableComponent } from './chart-table.component';


@NgModule({
  imports:[FormsModule,BrowserModule,SharedModule,ChartsModule],
    declarations: [ChartTableComponent],
    exports :[ChartTableComponent]
})
export class ChartTableModule { }