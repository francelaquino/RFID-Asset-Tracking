import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigntoworkorderComponent } from './assigntoworkorder.component';

describe('CheckoutComponent', () => {
  let component: AssigntoworkorderComponent;
  let fixture: ComponentFixture<AssigntoworkorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssigntoworkorderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigntoworkorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
