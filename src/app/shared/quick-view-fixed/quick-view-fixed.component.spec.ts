import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickViewFixedComponent } from './quick-view-fixed.component';

describe('QuickViewFixedComponent', () => {
  let component: QuickViewFixedComponent;
  let fixture: ComponentFixture<QuickViewFixedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickViewFixedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickViewFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
