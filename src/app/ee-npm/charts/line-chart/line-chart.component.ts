import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
 @Input() lineCharts: any;
  constructor() { }

  ngOnInit() {
    if (!this.lineCharts[0]) {
            // this._chart = new Highcharts.Chart(this.chartEl.nativeElement, this.configurationService.getlineChartDataConfig(this.lineCharts));
            // this._largechart = new Highcharts.Chart(this.chartE2.nativeElement, this.configurationService.getlineChartDataConfig(this.lineCharts));
            // if (this.showfullScreen) {
            //     this._chart.setSize(1255, 500);
            // } else {
            //     this._chart.setSize(618, 400);
            // }
        }
  }

}
