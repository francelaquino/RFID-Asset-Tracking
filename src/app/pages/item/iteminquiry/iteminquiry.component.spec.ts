import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IteminquiryComponent } from './iteminquiry.component';

describe('IteminquiryComponent', () => {
  let component: IteminquiryComponent;
  let fixture: ComponentFixture<IteminquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IteminquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IteminquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
