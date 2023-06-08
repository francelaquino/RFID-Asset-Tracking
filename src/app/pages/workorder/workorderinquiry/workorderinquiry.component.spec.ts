import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderinquiryComponent } from './workorderinquiry.component';

describe('WorkorderinquiryComponent', () => {
  let component: WorkorderinquiryComponent;
  let fixture: ComponentFixture<WorkorderinquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkorderinquiryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkorderinquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
