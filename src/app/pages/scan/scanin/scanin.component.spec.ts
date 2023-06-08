import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaninComponent } from './scanin.component';

describe('ScanoutComponent', () => {
  let component: ScaninComponent;
  let fixture: ComponentFixture<ScaninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScaninComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScaninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
