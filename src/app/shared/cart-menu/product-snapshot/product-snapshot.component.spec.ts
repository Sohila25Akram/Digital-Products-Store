import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSnapshotComponent } from './product-snapshot.component';

describe('ProductSnapshotComponent', () => {
  let component: ProductSnapshotComponent;
  let fixture: ComponentFixture<ProductSnapshotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSnapshotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSnapshotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
