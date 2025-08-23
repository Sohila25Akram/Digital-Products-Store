import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseAuth = inject(Auth)

  login(email: string, password: string): Observable<void>{
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => {});

    return from(promise);
  }

  signup(email: string, password: string): Observable<void>{
    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password).then(() => {})

    return from(promise)
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      onAuthStateChanged(this.firebaseAuth, (user) => {
        observer.next(!!user);
      });
    });
  }
  
  getCurrentUser(): Observable<User | null> {
    return new Observable<User | null>((observer) => {
      onAuthStateChanged(this.firebaseAuth, (firebaseUser) => {
        if (firebaseUser) {
          observer.next({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName
          });
        } else {
          observer.next(null);
        }
      });
    });
  }

  logout(): Observable<void>{
    const promise = signOut(this.firebaseAuth);
    return from(promise)
  }
}
