import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnavailableitemComponent } from './unavailableitem.component';

describe('UnavailableitemComponent', () => {
  let component: UnavailableitemComponent;
  let fixture: ComponentFixture<UnavailableitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnavailableitemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnavailableitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
