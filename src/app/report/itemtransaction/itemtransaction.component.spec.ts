import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemtransactionComponent } from './itemtransaction.component';

describe('ItemtransactionComponent', () => {
  let component: ItemtransactionComponent;
  let fixture: ComponentFixture<ItemtransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemtransactionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemtransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
