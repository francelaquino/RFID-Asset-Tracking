import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewreaderComponent } from './newreader.component';

describe('NewreaderComponent', () => {
  let component: NewreaderComponent;
  let fixture: ComponentFixture<NewreaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewreaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewreaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
