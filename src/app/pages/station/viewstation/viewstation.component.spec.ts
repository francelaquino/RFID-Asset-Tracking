import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewstationComponent } from './viewstation.component';

describe('ViewstationComponent', () => {
  let component: ViewstationComponent;
  let fixture: ComponentFixture<ViewstationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewstationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewstationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
