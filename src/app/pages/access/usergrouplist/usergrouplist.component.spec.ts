import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsergrouplistComponent } from './usergrouplist.component';

describe('UsergrouplistComponent', () => {
  let component: UsergrouplistComponent;
  let fixture: ComponentFixture<UsergrouplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsergrouplistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsergrouplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
