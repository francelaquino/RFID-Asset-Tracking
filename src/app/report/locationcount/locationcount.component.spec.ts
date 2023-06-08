import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationcountComponent } from './locationcount.component';

describe('LocationcountComponent', () => {
  let component: LocationcountComponent;
  let fixture: ComponentFixture<LocationcountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationcountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationcountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
