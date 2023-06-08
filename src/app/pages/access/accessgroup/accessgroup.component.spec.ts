import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessgroupComponent } from './accessgroup.component';

describe('AccessgroupComponent', () => {
  let component: AccessgroupComponent;
  let fixture: ComponentFixture<AccessgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessgroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
