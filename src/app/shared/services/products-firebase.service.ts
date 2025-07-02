import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Firestore } from '@angular/fire/firestore';
import { from, map, Observable, of, pipe, switchMap, take } from 'rxjs';
import { Product } from '../models/product.model';
import { DocumentData } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductsFirebaseService {

  firestore = inject(Firestore);
  productsCollection: CollectionReference<DocumentData> = collection(this.firestore, 'products');
  cartCollection: CollectionReference<DocumentData> = collection(this.firestore, 'cart');
  wishlistCollection: CollectionReference<DocumentData> = collection(this.firestore, 'wishlist');

  getProducts(): Observable<Product[]>{
    return collectionData(this.productsCollection, {
      idField: 'id'
    }) as Observable<Product[]>
  }

  getProductsInCart(): Observable<{ product: any; amount: number }[]> {
    return collectionData(this.cartCollection, { idField: 'id' }) as Observable<{ product: any; amount: number }[]>
  }


  // ------------ addProduct product not exists without change it to the new amount -----------
//   addProducttoCart(productId: string, amount: number) {
//   return this.getProductsInCart().pipe(
//     take(1),
//     switchMap((cartItems) => {
//       const exists = cartItems.some(item => item.product.id === productId);
//       if (exists) {
//         console.warn('Product already in cart');
//         return of(null); // Or throwError(() => new Error('Product already in cart'));
//       }

//       return this.getProducts().pipe(
//         take(1),
//         map((products) => {
//           const newProduct = products.find(p => p.id === productId);
//           if (!newProduct) throw new Error('Product not found');
//           return { product: newProduct, amount };
//         }),
//         switchMap((newProductToCart) =>
//           from(addDoc(this.cartCollection, newProductToCart)).pipe(
//             map(() => newProductToCart)
//           )
//         )
//       );
//     })
//   );
// }


  addProducttoCart(productId: string, amount: number) {
    return this.getProductsInCart().pipe(
      take(1),
      switchMap((cartItems) => {
        const existingItem = cartItems.find(item => item.product.id === productId);

        if (existingItem) {
          if (existingItem.amount === amount) {
            console.warn('⛔ Product already in cart with same amount');
            return of(null);
          }

          return this.deleteProductFromCart(productId).pipe(
            switchMap(() =>
              this.getProducts().pipe(
                take(1),
                map((products) => {
                  const product = products.find(p => p.id === productId);
                  if (!product) throw new Error('Product not found');
                  return { product, amount };
                }),
                switchMap((newProductToCart) =>
                  from(addDoc(this.cartCollection, newProductToCart)).pipe(
                    map(() => newProductToCart)
                  )
                )
              )
            )
          );
        }
        return this.getProducts().pipe(
          take(1),
          map((products) => {
            const product = products.find(p => p.id === productId);
            if (!product) throw new Error('Product not found');
            return { product, amount };
          }),
          switchMap((newProductToCart) =>
            from(addDoc(this.cartCollection, newProductToCart)).pipe(
              map(() => newProductToCart)
            )
          )
        );
      })
    );
  }

  deleteProductFromCart(productId: string): Observable<string>{
  const cartQuery = query(this.cartCollection, where('product.id', '==', productId));

  return from(getDocs(cartQuery)).pipe(
    switchMap((querySnapshot) => {
      if (querySnapshot.empty) {
        throw new Error('Product not found in Firestore cart');
      }

      const docId = querySnapshot.docs[0].id;
      const docRef = doc(this.firestore, 'cart', docId);
      return from(deleteDoc(docRef)).pipe(map(() => productId));
    }));
  }

  getProductsWishlist(): Observable<Product[]>{
    return collectionData(this.wishlistCollection, {idField: 'id'}) as Observable<Product[]>
  }

  addProductToWishlist(productId: string){
    return this.getProductsWishlist().pipe(
      map(wishlistItems => wishlistItems.some(p => p.id === productId)),
      take(1),
      switchMap(exists => {
        if(exists){
          console.warn('Product already in wishlist');
          return of(null);
        }

        return this.getProducts().pipe(
          map(products => products.find(p => p.id === productId)),
          switchMap(product => {
            if (!product) {
              throw new Error('Product not found');
            }

            const wishlistDocRef = doc(this.wishlistCollection);

            return from(setDoc(wishlistDocRef, product)).pipe(
              map(() => product)
            );
          })
        );
        
      })
    )
  }

  deleteFromWishlist(productId: string): Observable<any>{
    const docRef = doc(this.wishlistCollection, productId);
    // const promise = deleteDoc(docRef);

    return from(getDoc(docRef)).pipe(
      switchMap(docSnap => docSnap.exists()
        ? from(deleteDoc(docRef)).pipe(map(() => docSnap.data()))
        : of(null)
      )
    )
  }
}
