import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customized-cell',
  templateUrl: './customized-cell.component.html',
  styleUrls: ['./customized-cell.component.css']
})
export class CustomizedCellComponent  {

  private params: any;
    public value: any;
    public styles: any;

    // called on init
    agInit(params: any): void {
        this.params = params;
        this.value = this.params.value;

        this.styles = {
            width: this.value + "%",
            backgroundColor: '#00A000'
        };

        if (this.value < 20) {
            this.styles.backgroundColor = 'red';
        } else if (this.params.value < 60) {
            this.styles.backgroundColor = '#ff9900';
        }
    }

}
