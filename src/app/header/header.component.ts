import { Component, computed, ElementRef, inject, ViewChild } from '@angular/core';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '../shared/services/products.service';
import { MenuComponent } from './menu/menu.component';
import { WrapperComponent } from '../shared/wrapper/wrapper.component';
import { SearchedProductComponent } from './searched-product/searched-product.component';
import { Product } from '../shared/models/product.model';
import { debounceTime, map, Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    NavigationBarComponent,
    MenuComponent,
    WrapperComponent,
    SearchedProductComponent,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private productsService = inject(ProductsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  isOpen: boolean = false;
  isOpenUserInfo = false;

  currentUserEmail:string | null = null;

  searchedTerm = new FormControl('');
  searchedProducts!: Observable<Product[]>;

  @ViewChild('resBox') resBox!: ElementRef<HTMLDivElement>;

  openSearchBox: boolean = false;

  onOpenMenu() {
    this.isOpen = true;
    setTimeout(() => {
      this.resBox?.nativeElement.focus();
    })
  }
  onCloseMenu(isClosed: boolean) {
    this.isOpen = isClosed;
  }

  numOfProducts = computed(
    () => this.productsService.productsAddedToCart().length
  );

  constructor() {
    this.searchedProducts = this.searchedTerm.valueChanges.pipe(
      debounceTime(300),
      switchMap((searchTerm) =>
        this.productsService.searchProductsByName(searchTerm || '')
      )
    );
  }

  goToAccount(){
    if(this.isOpenUserInfo){
      this.isOpenUserInfo = false;
    }else{
      this.authService.isAuthenticated().subscribe(isAuth => {
        if(isAuth){
          this.isOpenUserInfo = true;
          this.authService.getCurrentUser().subscribe((res) => {
            if (res) {
              this.currentUserEmail = res.email ?? null;
            }
          });
        } else {
          this.isOpenUserInfo = false;
          this.router.navigate(['./auth']);
        }
      });
    }
  }

  logout(){
    this.authService.logout().subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (err) => {
        console.log(err)
      }
    });
  }
}
