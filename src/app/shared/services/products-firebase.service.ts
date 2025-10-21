import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, query, updateDoc, where } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { from, map, Observable, of, pipe, switchMap, take } from 'rxjs';
import { Product } from '../models/product.model';
import { DocumentData } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsFirebaseService {

  firestore = inject(Firestore);
  productsCollection: CollectionReference<DocumentData> = collection(this.firestore, 'products');
  cartCollection: CollectionReference<DocumentData> = collection(this.firestore, 'cart');
  wishlistCollection: CollectionReference<DocumentData> = collection(this.firestore, 'wishlist');

  private authService = inject(AuthService);

  getProducts(): Observable<Product[]>{
    return collectionData(this.productsCollection, {
      idField: 'id'
    }) as Observable<Product[]>
  }

  getProductsInCart(): Observable<{ id: string, product: Product; amount: number, userId: string }[]> {
    return this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (!user) return of([]);

        const userCartQuery = query(
          this.cartCollection,
          where('userId', '==', user.uid)
        );

        return collectionData(userCartQuery, { idField: 'id' }) as Observable<
          { id: string, product: Product; amount: number, userId: string }[]
        >;
      })
    );
  }

  private createCartItem(productId: string, amount: number, userId: string) {
    return this.getProducts().pipe(
      take(1),
      map((products) => {
        const product = products.find(p => p.id === productId);
        if (!product) throw new Error('Product not found');
        return { product, amount, userId };
      }),
      switchMap((newProductToCart) =>
        from(addDoc(this.cartCollection, newProductToCart)).pipe(
          map(() => newProductToCart)
        )
      )
    );
  }

  private createWishlistItem(productId: string, userId: string) {
    return this.getProducts().pipe(
      take(1),
      map((products) => {
        const product = products.find(p => p.id === productId);
        if (!product) throw new Error('Product not found');
        return { product, userId };
      }),
      switchMap((newProductToWishlist) =>
        from(addDoc(this.wishlistCollection, newProductToWishlist)).pipe(
          map(() => newProductToWishlist)
        )
      )
    );
  }

  addProducttoCart(productId: string, amount: number) {
    return this.authService.getCurrentUser().pipe(
      take(1),
      switchMap(user => {
        if (!user) throw new Error('User not logged in');
        const userId = user.uid;

        return this.getProductsInCart().pipe(
          take(1),
          switchMap((cartItems) => {
            const existingItem = cartItems.find(item => item.product.id === productId);

            if (existingItem) {
              if (existingItem.amount === amount) {
                console.warn('⛔ Product already in cart with same amount');
                return of(null);
              }

              return this.deleteProductFromCart(productId).pipe( switchMap(() => this.createCartItem(productId, amount, userId)) );
            }

            return this.createCartItem(productId, amount, userId);
          })
        );
      })
    );
  }

  deleteProductFromCart(productId: string): Observable<string>{
    return this.getProductsInCart().pipe(
      take(1),
      switchMap((cartItems) => {
        const item = cartItems.find(cart => cart.product.id === productId);

        if (item && item.id) {
          const docRef = doc(this.cartCollection, item.id);
          return from(deleteDoc(docRef)).pipe(
            map(() => `Product with id ${productId} deleted successfully`)
          );
        }

        return of(`Product with id ${productId} not found in cart`);
      })
    );
  }

  getProductsWishlist(): Observable<{id: string, product: Product, userId: string}[]>{
     return this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (!user) return of([]);

        const userWishlistQuery = query(
          this.wishlistCollection,
          where('userId', '==', user.uid)
        );

        return collectionData(userWishlistQuery, { idField: 'id' }) as Observable<
          { id: string, product: Product, userId: string }[]
        >;
      })
    );
  }

  addProductToWishlist(productId: string){
    return this.authService.getCurrentUser().pipe(
      take(1),
      switchMap(user => {
        if (!user) throw new Error('User not logged in');
        const userId = user.uid;

         return this.getProductsWishlist().pipe(
          take(1),
          switchMap((wishlistItems) => {
            const existingItem = wishlistItems.find(item => item.product.id === productId);

            if (existingItem) {
              console.log('it in the wislist'); 
              return of(null);         
            }

            return this.createWishlistItem(productId, userId);
          })
        );
      })
    )
  }

  deleteFromWishlist(productId: string): Observable<any>{
     return this.getProductsWishlist().pipe(
      take(1),
      switchMap((wishlistItems) => {
        const item = wishlistItems.find(wishlist => wishlist.product.id === productId);

        if (item && item.id){
          const docRef = doc(this.wishlistCollection, item.id);
          return from(deleteDoc(docRef)).pipe(
            map(() => `Product with id ${productId} deleted successfully`)
          );
        }

        return of(`Product with id ${productId} not found in wishlist`);
      })
    );
  }
}
