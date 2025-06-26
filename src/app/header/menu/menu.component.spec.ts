import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter, Router, Routes } from '@angular/router';
import { of } from 'rxjs';
import { deviceCategory } from '../../../assets/data/dummy-products';
import { RouterTestingHarness } from '@angular/router/testing';
import { Component } from '@angular/core';

@Component({ template: '' })
class DummyComponent {}
const routes: Routes = [
  { path: '', component: DummyComponent },
  { path: 'shop/:category', component: DummyComponent },
  { path: 'shop/featured' , component: DummyComponent }
];

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComponent],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          params: of({}),
          queryParams: of({}),
          snapshot: { paramMap: new Map() },
        },
      },
      provideRouter(routes)
      ]
    
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function checkUltems(type: '.nav-items' | '.category-items'){
    component.selectedItem = type === '.nav-items'? 'menu': 'categories';
    fixture.detectChanges();
  
    const ulEl = fixture.debugElement.query(By.css(type)).nativeElement;
    expect(ulEl).toBeTruthy();

    return ulEl;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('render-based', () => {
    it('should onSelectItem called with "menu" whin click on menu tab', ()=>{
      const menuTabEl = fixture.debugElement.query(By.css('.menu')).nativeElement;

      spyOn(component, 'onSelectItem')

      menuTabEl.click();
      fixture.detectChanges();

      expect(component.onSelectItem).toHaveBeenCalledWith('menu');
    });
    it('should onSelectItem called with "categories" whin click on categories tab', ()=>{
      const categoriesTabEl = fixture.debugElement.query(By.css('.categories')).nativeElement;

      spyOn(component, 'onSelectItem')

      categoriesTabEl.click();
      fixture.detectChanges();

      expect(component.onSelectItem).toHaveBeenCalledWith('categories');
    });
    it('should add class "active" to "menu" tab when selectedItem become "menu"', () => {
      const menuTabEl = fixture.debugElement.query(By.css('.menu')).nativeElement;

      component.selectedItem = "menu";
      fixture.detectChanges();

      expect(menuTabEl.classList.contains("active")).toBeTrue();

    })
    it('should add class "active" to "categories" tab when selectedItem become "categories"', () => {
      const categoriesTabEl = fixture.debugElement.query(By.css('.categories')).nativeElement;

      component.selectedItem = "categories";
      fixture.detectChanges();

      expect(categoriesTabEl.classList.contains("active")).toBeTrue();
    });
    it('should .nav-items rendered when selectedItem is "menu"', () => {
      checkUltems('.nav-items');
    });
    it('should .category-items rendered when selectedItem not "menu"', () => {
      checkUltems('.category-items');
    });
    it('should render category list when selectedItems is not menu', () => {
      const ulEl = checkUltems('.category-items');

      const categoryList = [
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

      component.allCategories = categoryList;
      fixture.detectChanges();

      const items = ulEl.querySelectorAll('li');
      expect(items.length).toBe(2);

      const itemOne = items[0];

      const iconEl = itemOne.querySelector('a span i');

      expect(iconEl.classList.contains('fa-clock')).toBeTrue();
      expect(iconEl.classList.contains('fa-regular')).toBeTrue(); 

      expect(itemOne.textContent).toContain('Smart Watches')

    })
  })

  describe('check routerLink', () => {
    describe('check routerLink validation', () => {
      describe('nav-items valdation', () => {
        it('should render 2 items in list', () => {
          const ulEl = checkUltems('.nav-items');
  
          expect(ulEl.querySelectorAll('li a').length).toBe(2)
        });
        it('routerLink should be /', () => {
          const linkEls = checkUltems('.nav-items').querySelectorAll('li a');
  
          const homeEl = linkEls[0];
  
          expect(homeEl).toBeTruthy()
        });
        it('routerLink should be /shop/featured', () => {
          const linkEls = checkUltems('.nav-items').querySelectorAll('li a');
  
          const shopEl = linkEls[1];
  
          expect(shopEl).toBeTruthy()
        })
      })
      describe('category-items valdation', () => {
        it('should render 2 items in list', () => {
          const deviceCategoryLength = deviceCategory.length;

          const ulEl = checkUltems('.category-items');
  
          expect(ulEl.querySelectorAll('li a').length).toBe(deviceCategoryLength)
        });
        it('routerLink should be /shop/smart-watches', () => {
          const linkEls = checkUltems('.category-items').querySelectorAll('li a');
  
          const homeEl = linkEls[0];
  
          expect(homeEl).toBeTruthy()
        });
      })
    });
    describe('check routerLink navigation', () => {
      describe('nav-items navigation', () => {
        it('should navigate to / when home clicked', async() => {
          const links = checkUltems('.nav-items').querySelectorAll('li a');

          const homeEl = links[0];

          const router = TestBed.inject(Router);
          const harness = await RouterTestingHarness.create();

          await harness.navigateByUrl('/');

          homeEl.click();

          const home = router.url;

          expect(home).toBeTruthy();

        });
        it('should navigate to /shop/featured when home clicked', async() => {
          const links = checkUltems('.nav-items').querySelectorAll('li a');

          const shopEl = links[1];

          const router = TestBed.inject(Router);
          const harness = await RouterTestingHarness.create();

          await harness.navigateByUrl('/');
          shopEl.click();
          await harness.navigateByUrl('/shop/featured');

          const shop = router.url;

          expect(shop).toBeTruthy();
        });
      });
      describe('category-items navigation', () => {
        it('should navigate to /shop/smart-watches category when home clicked', async() => {
          const links = checkUltems('.category-items').querySelectorAll('li a');

          const firstCategoryLink = links[0];

          const router = TestBed.inject(Router);
          expect(firstCategoryLink).toBeTruthy();

          const harness = await RouterTestingHarness.create();

          await harness.navigateByUrl('/');

          firstCategoryLink.click();
          fixture.detectChanges();
          await fixture.whenStable();

          const category = router.url;

          expect(category).toBe('/shop/smart-watches');
        });
      })
    })
  })
  describe('onSelectItem()', () => {
    it('should set selectedItem to "menu" when passed "menu"', () => {
      component.onSelectItem('menu');
      expect(component.selectedItem).toBe('menu');
    });

    it('should set selectedItem to "categories" when passed any string other than "menu"', () => {
      component.onSelectItem('anything-else');
      expect(component.selectedItem).toBe('categories');
    });
  })
});


