import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateworkorderComponent } from './createworkorder.component';

describe('CreateworkorderComponent', () => {
  let component: CreateworkorderComponent;
  let fixture: ComponentFixture<CreateworkorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateworkorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateworkorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
