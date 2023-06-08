import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewreaderComponent } from './viewreader.component';

describe('ViewreaderComponent', () => {
  let component: ViewreaderComponent;
  let fixture: ComponentFixture<ViewreaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewreaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewreaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
