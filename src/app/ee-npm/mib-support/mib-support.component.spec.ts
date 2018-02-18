import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MibSupportComponent } from './mib-support.component';

describe('MibSupportComponent', () => {
  let component: MibSupportComponent;
  let fixture: ComponentFixture<MibSupportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MibSupportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MibSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
