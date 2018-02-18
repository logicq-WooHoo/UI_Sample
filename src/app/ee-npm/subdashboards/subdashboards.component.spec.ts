import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubdashboardsComponent } from './subdashboards.component';

describe('SubdashboardsComponent', () => {
  let component: SubdashboardsComponent;
  let fixture: ComponentFixture<SubdashboardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubdashboardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubdashboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
