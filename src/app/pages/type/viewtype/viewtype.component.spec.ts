import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewtypeComponent } from './viewtype.component';

describe('ViewtypeComponent', () => {
  let component: ViewtypeComponent;
  let fixture: ComponentFixture<ViewtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewtypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
