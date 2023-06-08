import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigntagComponent } from './assigntag.component';

describe('AssigntagComponent', () => {
  let component: AssigntagComponent;
  let fixture: ComponentFixture<AssigntagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssigntagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigntagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
