import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySwiperComponent } from './category-swiper.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ElementRef, Renderer2 } from '@angular/core';

describe('CategorySwiperComponent', () => {
  let component: CategorySwiperComponent;
  let fixture: ComponentFixture<CategorySwiperComponent>;
  let renderer: jasmine.SpyObj<Renderer2>;

  beforeEach(async () => {
    renderer = jasmine.createSpyObj('Renderer2', ['setProperty']);

    await TestBed.configureTestingModule({
      imports: [CategorySwiperComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: { paramMap: new Map() },
          },
        },
      
        { provide: Renderer2, useValue: renderer }
        
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySwiperComponent);
    component = fixture.componentInstance;
     const mockCategores = [
      {
        value: 'smart-watches',
        name: 'Smart Watches',
        icon: 'fa-regular fa-clock',
        imgSrc: 'smart-watches.jpg',
        brands: ['sumsung', 'vogal', 'wavefast'],
      },
      {
        value: 'smart-tvs',
        name: 'Smart TVs',
        icon: 'fa-solid fa-tv',
        imgSrc: 'smart-tvs.jpg',
        brands: ['oliva', 'toshibar', 'vogal'],
      },
    ]

    component.allCategories = mockCategores;
   
    fixture.detectChanges();
    (component as any).renderer = renderer;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render list of categores card', () => {
    const categoryCards = fixture.debugElement.queryAll(By.css('.category-card'));

    expect(categoryCards.length).toBe(2);

    const categoryCardOneEl = categoryCards[0].nativeElement;

    const imagOneEl = categoryCardOneEl.querySelector('img');

    expect(imagOneEl.src).toContain('assets/images/categories/smart-watches.jpg');
    expect(imagOneEl.alt).toContain('Smart Watches');

    const headerOneEl = categoryCardOneEl.querySelector('h3')
    expect(headerOneEl.textContent).toContain('Smart Watches')
  })
  it('should scroll called with next when click on next-btn', () => {
    const nextBtnEl = fixture.debugElement.query(By.css('.next-btn')).nativeElement;

    spyOn(component, 'scroll');

    nextBtnEl.click();
    fixture.detectChanges();

    expect(component.scroll).toHaveBeenCalledWith('next');
  });
  it('should scroll called with next when click on next-btn', () => {
    const prevBtnEl = fixture.debugElement.query(By.css('.prev-btn')).nativeElement;

    spyOn(component, 'scroll');

    prevBtnEl.click();
    fixture.detectChanges();

    expect(component.scroll).toHaveBeenCalledWith('prev');
  })

  it('should set firstCardWidth after view init', () => {
    // const categoryCard = document.createElement('div');
    // categoryCard.className = 'category-card';
    // Object.defineProperty(categoryCard, 'offsetWidth', { value: 150 });

    // fixture.nativeElement.appendChild(categoryCard);
    // fixture.detectChanges();
    const categoryCard = fixture.debugElement.query(By.css('.category-card')).nativeElement;
    const cardWidth = categoryCard.offsetWidth;

    component.ngAfterViewInit();

    expect(component.firstCardWidth).toBe(cardWidth);

  })

//   it('should scroll to next or previous based on direction', () => {

//     // const categoryCard = fixture.debugElement.query(By.css('.category-card')).nativeElement;
//     // const cardWidth = categoryCard.offsetWidth;

//     // component.scroll('prev');

//     // expect(component.firstCardWidth).toBe(-cardWidth);

  

//     // expect(component.swiperContainer.nativeElement.scrollLeft).toBe(component.swiperContainer.nativeElement.scrollLeft + component.firstCardWidth);

//     // const rendererSpy = spyOn(renderer, 'setProperty');

//     // expect(rendererSpy).toHaveBeenCalledWith(categoryCard, 'scrollLeft', 200);

// //-----------------------------

//     // const mockScrollLeft = 200;
//     // const mockElement = {
//     //   scrollLeft: mockScrollLeft
//     // };
  
//     // component.firstCardWidth = 100;
  
//     // component.swiperContainer = {
//     //   nativeElement: mockElement
//     // } as ElementRef;
  
//     // const rendererSpy = spyOn(renderer, 'setProperty');
  

//     // component.swiperContainer;
//     // // Scroll next
//     // component.scroll('next');
//     // expect(rendererSpy).toHaveBeenCalledWith(mockElement, 'scrollLeft', 300);
  
//     // // Scroll prev
//     // component.scroll('prev');
//     // expect(rendererSpy).toHaveBeenCalledWith(mockElement, 'scrollLeft', 200);
//   });
  
// it('should log error if swiperContainer is not available', () => {
//   component.swiperContainer = null;

//   const consoleSpy = spyOn(console, 'error');

//   component.scroll('next');

//   expect(consoleSpy).toHaveBeenCalledWith('Swiper container not found');
// });
  
});
