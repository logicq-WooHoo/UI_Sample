import { Component, OnInit, EventEmitter, Output } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-mib-support',
  templateUrl: './mib-support.component.html',
  styleUrls: ['./mib-support.component.css']
})
export class MibSupportComponent implements OnInit {

  @Output('toggleClass') toggleClass = new EventEmitter();
  public header: any;
  public eventArray: any;
  constructor() { }

  ngOnInit() {
    let actions = { actions: { view: 'true', enableMIB: 'true', enableOID: 'true' } };

    this.header = [{ id: 'deviceType', displayName: 'Device Type' }, { id: 'SubElementType', displayName: 'Sub Element Type' },
    { id: 'mibName', displayName: 'Mib Name' }, { id: 'actions', displayName: 'Actions' }, { id: 'actions.view', displayName: '' }, { id: 'actions.enableMIB', displayName: '' }, { id: 'actions.enableOID', displayName: '' }]

    this.eventArray = [{ event: { deviceType: 'AGW1', SubElementType: 'Sub Element', mibName: 'MIB1' } }, { event: { deviceType: "AGW2", SubElementType: 'Sub Element', mibName: 'MIB2' } }, { event: { deviceType: "AGW3", SubElementType: 'Sub Element', mibName: 'MIB3' } }];

    for (let events of this.eventArray) {
      $.extend(events.event, actions);
    }

  }


}
