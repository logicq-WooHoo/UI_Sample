import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicCounterComponent } from './dynamic-counter.component';

describe('DynamicCounterComponent', () => {
  let component: DynamicCounterComponent;
  let fixture: ComponentFixture<DynamicCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
