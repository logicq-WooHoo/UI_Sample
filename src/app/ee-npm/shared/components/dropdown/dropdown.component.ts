import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import {
    NgModel,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS,
    ControlValueAccessor,
    NG_ASYNC_VALIDATORS
} from '@angular/forms';

const noop = () => {
};

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.css'],
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: DropdownComponent, multi: true }
    ]
})

export class DropdownComponent implements ControlValueAccessor, OnInit {

    @Input() label: string;
    @Input() dropList: any;
    private innerValue: any;
    @Input('object-name') objectName: any;
    @Input('search-argument') searchArgument: string;
    @Output() valueChanges = new EventEmitter();

    private onTouchedCallback: () => void = noop;
    private onChangeCallback: (_: any) => void = noop;

    //get accessor
    get value(): any {
        return this.innerValue;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.innerValue) {
            this.innerValue = v;
            this.onChangeCallback(v);
        }
    }

    //Set touched on blur
    onBlur() {
        this.onTouchedCallback();
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.innerValue) {
            this.innerValue = value;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    public inputModel: string;
    constructor() { }

    ngOnInit() {

    }

    assignValue(droplistitem) {
        if (droplistitem != undefined && droplistitem[this.objectName] != undefined) {
            this.valueChanges.emit(droplistitem);
            this.inputModel = droplistitem[this.objectName];
        } else {
            this.valueChanges.emit(droplistitem);
            this.inputModel = droplistitem;
        }

    }



}
