import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EENpmComponent } from './ee-npm.component';

describe('NpmComponent', () => {
  let component: EENpmComponent;
  let fixture: ComponentFixture<EENpmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EENpmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EENpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
