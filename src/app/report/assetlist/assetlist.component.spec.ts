import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetlistComponent } from './assetlist.component';

describe('AssetlistComponent', () => {
  let component: AssetlistComponent;
  let fixture: ComponentFixture<AssetlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
