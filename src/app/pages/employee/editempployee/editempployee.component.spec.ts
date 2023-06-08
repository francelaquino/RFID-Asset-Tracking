import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditempployeeComponent } from './editempployee.component';

describe('EditempployeeComponent', () => {
  let component: EditempployeeComponent;
  let fixture: ComponentFixture<EditempployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditempployeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditempployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
