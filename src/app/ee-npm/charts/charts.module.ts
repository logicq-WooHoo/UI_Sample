import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {LineChartComponent} from './line-chart/line-chart.component';
import {ChartsComponent} from './charts.component';
import {SharedModule} from '../shared/shared.module';
import { InlineChartComponent } from './inline-chart/inline-chart.component';

@NgModule({
  imports:[FormsModule,BrowserModule,SharedModule],
    declarations: [LineChartComponent, ChartsComponent, InlineChartComponent,InlineChartComponent],
    exports :[LineChartComponent,ChartsComponent,InlineChartComponent]
})
export class ChartsModule { }
