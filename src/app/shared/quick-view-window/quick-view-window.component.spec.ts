import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickViewWindowComponent } from './quick-view-window.component';

describe('QuickViewWindowComponent', () => {
  let component: QuickViewWindowComponent;
  let fixture: ComponentFixture<QuickViewWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickViewWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickViewWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
