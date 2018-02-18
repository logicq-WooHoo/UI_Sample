import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPipe } from './pipes/searchpipe';
import { OrderBy } from './pipes/orderByPipe';
import { CustomDate } from './pipes/customDatePipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { ModalClickOutsideDirective } from './directives/modal-click-outside.directive';
import { FormValidatorDirective } from './directives/FormValidator.directive';
import { TableMouseOverDirective } from './directives/table-mouseover.directive';
import { PaginationModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import {LoadComponentDirective} from './directives/load-component.directive';
import {DataTableGridComponent} from './components/data-table-grid/data-table-grid.component';
import {AgGridModule} from "ag-grid-angular";

import { QueryBuilderComponent } from './components/query-builder/query-builder.component';

import { FieldErrorDisplayComponent } from './components/field-error-display/field-error-display.component';
import { CustomizedCellComponent } from './components/customized-cell/customized-cell.component';
import { ExportDataComponent } from './components/export-data/export-data.component';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';

@NgModule({
  imports: [FormsModule, BrowserModule,PaginationModule.forRoot(),RouterModule,AgGridModule.withComponents([
            CustomizedCellComponent
        ])
],
  declarations: [SearchPipe, OrderBy, CustomDate ,ClickOutsideDirective, FormValidatorDirective, TableMouseOverDirective, DropdownComponent,LoadComponentDirective,DataTableComponent,  FieldErrorDisplayComponent,ModalClickOutsideDirective, CustomizedCellComponent,DataTableGridComponent, ExportDataComponent,QueryBuilderComponent, BreadcrumbsComponent],
  exports: [SearchPipe, OrderBy,CustomDate ,ClickOutsideDirective, FormValidatorDirective, TableMouseOverDirective, DropdownComponent,LoadComponentDirective,DataTableComponent,FieldErrorDisplayComponent,ModalClickOutsideDirective,CustomizedCellComponent,DataTableGridComponent,ExportDataComponent,QueryBuilderComponent,BreadcrumbsComponent]
})
export class SharedModule { }
