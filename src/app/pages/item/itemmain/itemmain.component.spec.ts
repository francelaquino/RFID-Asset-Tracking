import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemmainComponent } from './itemmain.component';

describe('ItemmainComponent', () => {
  let component: ItemmainComponent;
  let fixture: ComponentFixture<ItemmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemmainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
