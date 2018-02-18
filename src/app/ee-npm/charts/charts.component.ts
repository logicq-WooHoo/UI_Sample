import { Component, OnInit, Input, ViewChild, ComponentFactoryResolver, SimpleChange } from '@angular/core';
import { InlineChartComponent } from './inline-chart/inline-chart.component';
import { ChartIndividualComponent } from './chart.utility';
import { ChartComponentInt } from './chart.utility';
import { LoadComponentDirective } from '../shared/directives/load-component.directive';
import { DataLoadSpinner } from '../services/dataLoadSpinner.service';
@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  @Input() data: any;
  @Input() chartType: any;
  @ViewChild(LoadComponentDirective) loadComponentDirective: LoadComponentDirective;
  @Input() menuToggle: any;
  @Input() refreshedData: any;
  @Input() index :any;
  @Input() height :any;
  componentGen: any;
  componentRef: any;
  public componentMap: Map<any, any> = new Map();
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private _spinner: DataLoadSpinner) {
    // this.componentMap.set("Spline",InlineChartComponent);
    // this.componentMap.set("Vertical Stacked Bar",ColumnChartComponent);
  }

  ngOnInit() {
    if (this.chartType) {
      (<ChartComponentInt>this.componentRef.instance).type.next(this.chartType);
    }

  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes["data"]) {
      this.loadComponent();
    } else if (changes["refreshedData"] && changes["refreshedData"].currentValue) {
      (<ChartComponentInt>this.componentRef.instance).refreshedData.next(changes["refreshedData"].currentValue);
    } else if (changes["chartType"]) {
      (<ChartComponentInt>this.componentRef.instance).type.next(this.chartType);
    } else if(changes["menuToggle"]){
      (<ChartComponentInt>this.componentRef.instance).menuToggle.next(changes["menuToggle"].currentValue);
    }else if(changes["height"]){
      this.loadComponent();
    }
  }


  loadComponent() {
    this.componentGen = new ChartIndividualComponent(InlineChartComponent, this.data, this.menuToggle, this.refreshedData, this.chartType, this.index,this.height);
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentGen.component);
    if (this.loadComponentDirective) {
      let viewContainerRef = this.loadComponentDirective.viewContainerRef;
      viewContainerRef.clear();
      this.componentRef = viewContainerRef.createComponent(componentFactory);
      (<ChartComponentInt>this.componentRef.instance).data = this.componentGen.data;
      (<ChartComponentInt>this.componentRef.instance).menuToggle.next(this.menuToggle);
      (<ChartComponentInt>this.componentRef.instance).type.next(this.chartType);
       (<ChartComponentInt>this.componentRef.instance).index = this.componentGen.index;
(<ChartComponentInt>this.componentRef.instance).height = this.componentGen.height;

    }
  }

  ngOnDestroy() {
    this.componentGen = null;
  }
}
