import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadMibComponent } from './upload-mib.component';

describe('UploadMibComponent', () => {
  let component: UploadMibComponent;
  let fixture: ComponentFixture<UploadMibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadMibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadMibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
