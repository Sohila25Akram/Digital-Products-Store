import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestSellerCardComponent } from './best-seller-card.component';
import { By } from '@angular/platform-browser';

describe('BestSellerCardComponent', () => {
  let component: BestSellerCardComponent;
  let fixture: ComponentFixture<BestSellerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BestSellerCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BestSellerCardComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('imgSrc', 'image.png');
    fixture.componentRef.setInput('title', 'title here');
    fixture.componentRef.setInput('desc', 'description gg');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should bigCard class added when isBig true', () => {
    const figureEl = fixture.debugElement.query(By.css('figure')).nativeElement;

    fixture.componentRef.setInput('isBig', true);
    fixture.detectChanges();

    expect(figureEl.classList.contains('bigCard'));
  })
  it('should background image style added', () => {
    const figureEl = fixture.debugElement.query(By.css('figure')).nativeElement;

    expect(figureEl.style.backgroundImage).toContain('url("./assets/images/banner-2/image.png")');
  })

  it('should return img when isBig true', () => {
    fixture.componentRef.setInput('isBig', true);
    fixture.detectChanges();

    const imgDe= fixture.debugElement.query(By.css('img'));

    expect(imgDe).toBeTruthy();

    const imgEl= imgDe.nativeElement;
    expect(imgEl.src).toContain('assets/images/banner-2/image.png');
  })

  it('should title and desc rendered', () => {
    const headerEl = fixture.debugElement.query(By.css('h2')).nativeElement;

    expect(headerEl.textContent).toContain('title here');

    const descEl = fixture.debugElement.query(By.css('p')).nativeElement;

    expect(descEl.textContent).toContain('description gg');
  })
});
