import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanoutComponent } from './scanout.component';

describe('ScanoutComponent', () => {
  let component: ScanoutComponent;
  let fixture: ComponentFixture<ScanoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScanoutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
