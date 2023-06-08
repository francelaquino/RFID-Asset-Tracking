import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewworkorderComponent } from './viewworkorder.component';

describe('ViewworkorderComponent', () => {
  let component: ViewworkorderComponent;
  let fixture: ComponentFixture<ViewworkorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewworkorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewworkorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
