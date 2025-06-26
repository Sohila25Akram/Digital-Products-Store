import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { QuickViewFixedComponent } from './quick-view-fixed.component';
import { ProductsService } from '../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Component, Directive, Input, NgModule } from '@angular/core';
import { LoaderDirective } from '../loader.directive';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { appConfig } from '../../app.config';

@Component({
  selector: 'app-quick-view-window',
  standalone: true,
  template: ''
})
export class QuickViewWindowStubComponent {
  @Input() isExpanded?: boolean = false;
}

@Directive({
  selector: '[appLoader]',
  standalone:true
})
class LoaderDirectiveStub {
  @Input('appLoader') loading!: boolean;
  @Input() addContainer!: boolean;
}

// describe('QuickViewFixedComponent', () => {
//   let component: QuickViewFixedComponent;
//   let fixture: ComponentFixture<QuickViewFixedComponent>;
//   let mockProductsService: jasmine.SpyObj<ProductsService>

//   beforeEach(async () => {
//     mockProductsService = jasmine.createSpyObj('ProductsService', ['loadedProducts']);
//     mockProductsService.loadedProducts.and.returnValue([]);

//     await TestBed.configureTestingModule(
//       Object.assign({}, appConfig, {
//       imports: [QuickViewFixedComponent, QuickViewWindowStubComponent, LoaderDirectiveStub],

//       // declarations: [LoaderDirectiveStub],
//       providers: [
//         {
//           provide: ProductsService,
//           useValue: mockProductsService
//         },
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             params: of({}),
//             queryParams: of({}),
//             snapshot: { paramMap: new Map() },
//           },
//         },
//       ],
//       // schemas: [NO_ERRORS_SCHEMA],
//     }))
//     .compileComponents();

//     fixture = TestBed.createComponent(QuickViewFixedComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('loader work', fakeAsync(() => {
//     fixture.detectChanges();

//     expect(component.isLoading()).toBeTrue();

//     tick(3000);
//     fixture.detectChanges();

//     expect(component.isLoading()).toBeFalse();
//   }))
// });
