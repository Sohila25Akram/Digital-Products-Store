import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';
import { ProductsService } from '../shared/services/products.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ProductCardComponent } from '../shared/product-card/product-card.component';
import { BestSellerCardComponent } from './best-seller-card/best-seller-card.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('ProductsService', ['loadedProducts']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, ProductCardComponent, BestSellerCardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { paramMap: new Map() },
          },
        },
        {provide: ProductsService, useValue: mockProductsService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();   
  });

  function selectBullets(){
    const el = fixture.debugElement.query(By.css('.swipper-bullets'));
    expect(el).not.toBeNull();
    const bulletsItems = el.nativeElement.querySelectorAll('span');

    return bulletsItems;
  }


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should called toggle slide when click on prev btn', () => {
    const prevBtnEl = fixture.debugElement.query(By.css('.swipper-btn.prev-btn')).nativeElement;

    spyOn(component, 'onToggleSlide');

    prevBtnEl.click();
    fixture.detectChanges();

    expect(component.onToggleSlide).toHaveBeenCalled();
  });
  it('should called toggle slide when click on next btn', () => {
    const nextBtnEl = fixture.debugElement.query(By.css('.swipper-btn.next-btn')).nativeElement;

    spyOn(component, 'onToggleSlide');

    nextBtnEl.click();
    fixture.detectChanges();

    expect(component.onToggleSlide).toHaveBeenCalled();
  });
  it('should called toggle slide when click on first bullet', () => {
    const firstBulletEl = selectBullets()[0];

    spyOn(component, 'onToggleSlide');

    firstBulletEl.click();
    fixture.detectChanges();

    expect(component.onToggleSlide).toHaveBeenCalled();
  });
  it('should called toggle slide when click on second bullet', () => {
    const secondBulletEl = selectBullets()[1];

    spyOn(component, 'onToggleSlide');

    secondBulletEl.click();
    fixture.detectChanges();

    expect(component.onToggleSlide).toHaveBeenCalled();
  });
  it('should .active class added to the first bullet when currentSlide equal 1', () => {
    const firstBulletEl = selectBullets()[0];

    component.currentSlide.set(1);
    fixture.detectChanges();

    expect(firstBulletEl.classList.contains("active")).toBeTrue()
  });
  it('should .active class added to the second bullet when currentSlide equal 2', () => {
    const secondBulletEl = selectBullets()[1];

    component.currentSlide.set(2);
    fixture.detectChanges();

    expect(secondBulletEl.classList.contains("active")).toBeTrue()
  });
  it('should .slide-1 returned if current slide equal 1', () => {
    component.currentSlide.set(1);
    fixture.detectChanges();

    const slideOneEl  = fixture.debugElement.query(By.css('.slide.slide-1')).nativeElement;

    expect(slideOneEl).toBeTruthy();
  });
  it('should .slide-2 returned if current slide not equal 1', () => {
    component.currentSlide.set(2);
    fixture.detectChanges();

    const slideTwoEl  = fixture.debugElement.query(By.css('.slide.slide-2')).nativeElement;

    expect(slideTwoEl).toBeTruthy();
  });


  it('should render list of best seller card', () => {   
    component.bestSellerSmallCards = [
      {
        "imgSrc" : "pexels-maria-mileta-3563033-15394136.jpg",
        "title": "Projectors",
        "desc": "4K Ultra HD with 8 million pixels"
      },
      {
        "imgSrc" : "pexels-martin_poland-1175242-15684881.jpg",
        "title": "Soundbars",
        "desc": "With Wireless Subwoofer for Extra Deep Bass"
      }
    ];
    fixture.detectChanges();
   

    // const bestSellerCardEls = fixture.debugElement.queryAll(By.directive(BestSellerCardComponent));
    // console.log(bestSellerCardEls, 'ptutut u');
    // expect(bestSellerCardEls.length).toBe(2);

    const headers = fixture.debugElement.queryAll(By.css('h5'));
    expect(headers.length).toBe(2)


    // const firstCard = bestSellerCardEls[0].nativeElement;
    // expect(firstCard.getAttribute('imgSrc')).toBe('pexels-maria-mileta-3563033-15394136.jpg');
    // expect(firstCard.getAttribute('title')).toBe('Projectors');
    // expect(firstCard.getAttribute('desc')).toBe('4K Ultra HD with 8 million pixels');

    // const secondCard = bestSellerCardEls[1].nativeElement;
    // expect(secondCard.getAttribute('imgSrc')).toBe('pexels-martin_poland-1175242-15684881.jpg');
    // expect(secondCard.getAttribute('title')).toBe('Soundbars');
    // expect(secondCard.getAttribute('desc')).toBe('With Wireless Subwoofer for Extra Deep Bass');
    
  // new way 
    // expect(bestSellerCardEls[0].componentInstance.title).toBe('Projectors');
  })

  // it('should return list of product cards', () => {
  //   component.products .set([
  //     {
  //       id: '1',
  //       title: 'Smart Watch Pro X',
  //       imgSrc: 'smartwatch-pro-x.jpg',
  //       originPrice: 299.99,
  //       newPrice: 199.99,
  //       discount: 33,
  //       brand: 'Wavefast',
  //       category: 'smart-watches',
  //       customers: 1200,
  //       addedDate: new Date('2025-03-15')
  //     },
  //     {
  //       id: '2',
  //       title: 'Ultra HD Smart TV 55"',
  //       imgSrc: 'ultra-hd-tv.jpg',
  //       originPrice: 799.99,
  //       discount: 20,
  //       newPrice: 639.99,
  //       brand: 'Oliva',
  //       category: 'smart-tvs',
  //       customers: 845,
  //       addedDate: new Date('2025-04-01')
  //     }
  //   ]);

  //   fixture.detectChanges();
    

  //   const productCardEls = fixture.debugElement.queryAll(By.css('app-product-card'));

  //   expect(productCardEls.length).toBe(2);
  // })

  it('should products return loadedProducts form the service', () => {
    const mockProducts = [{
      id: '2',
      title: 'Ultra HD Smart TV 55"',
      imgSrc: 'ultra-hd-tv.jpg',
      originPrice: 799.99,
      discount: 20,
      newPrice: 639.99,
      brand: 'Oliva',
      category: 'smart-tvs',
      customers: 845,
      addedDate: new Date('2025-04-01')
    }];

    mockProductsService.loadedProducts.and.returnValue(mockProducts);
  
    expect(component.products()).toEqual(mockProducts);
  })

  it('check onToggleSlide() work', () => {
    component.currentSlide.set(1);
    fixture.detectChanges();

    component.onToggleSlide();
    fixture.detectChanges();

    expect(component.currentSlide()).toBe(2);
  })
});
