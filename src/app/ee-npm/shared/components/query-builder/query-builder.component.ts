import { Component, OnInit,ViewEncapsulation } from '@angular/core';
declare var $:any;
@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css'],
  encapsulation : ViewEncapsulation.None
})
export class QueryBuilderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
     var rules_basic = {
  condition: 'AND',
  rules: [{
    id: 'price',
    operator: 'less',
    value: 10.25
  }, {
    condition: 'OR',
    rules: [{
      id: 'category',
      operator: 'equal',
      value: 2
    }, {
      id: 'category',
      operator: 'equal',
      value: 1
    }]
  }]
};
   $('#builder-basic').queryBuilder({
  
  filters: [
  //   {
  //   id: 'name',
  //   label: 'Name',
  //   type: 'string'
  // },
   {
    id: 'nodes',
    label: 'Nodes',
    type: 'integer',
    input: 'select',
    values: {
      16: 'UGW001LDS',
      2: 'UGW001LDS',
      3: 'UGW001LDS',
      4: 'UGW001LDS',
      5: 'UGW001LDS',
      6: 'UGW001LDS'
    },
    operators: ['equal', 'not_equal', 'in', 'not_in', 'is_null', 'is_not_null']
  }, {
    id: 'network',
    label: 'Network Name',
    type: 'string',
    input: 'select',
    values :{
      'emobile': 'E-Mobile',
      'BT' : 'BT network'
  },
    operators: ['equal', 'not_equal', 'in', 'not_in', 'is_null', 'is_not_null']
  }]
});
  }


getRules(){
  let rules = $('#builder-basic').queryBuilder('getRules');
  console.log(rules);
}
}
