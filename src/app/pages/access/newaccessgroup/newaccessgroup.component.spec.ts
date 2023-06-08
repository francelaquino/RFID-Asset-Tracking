import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewaccessgroupComponent } from './newaccessgroup.component';

describe('NewaccessgroupComponent', () => {
  let component: NewaccessgroupComponent;
  let fixture: ComponentFixture<NewaccessgroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewaccessgroupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewaccessgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
