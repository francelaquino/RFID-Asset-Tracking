import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditreaderComponent } from './editreader.component';

describe('EditreaderComponent', () => {
  let component: EditreaderComponent;
  let fixture: ComponentFixture<EditreaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditreaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditreaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
