import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
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

  constructor() { }

  private firebaseAuth = inject(Auth)

  save(key: string, value: any){
    localStorage.setItem(key, JSON.stringify(value))
  }

  get(key: string){
    const inLocal = localStorage.getItem(key);
    if(inLocal){
       return JSON.parse(inLocal)
    }
    return null;
  }

  login(email: string, password: string): Observable<void>{

    // const body = {email, password}

    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password).then(() => {});

    return from(promise);



    // const getRegisteredUser = this.get('registeredUser');
    // if(getRegisteredUser && getRegisteredUser.email === email && getRegisteredUser.password === password){
    //   this.save('currentUser', body);
    //   return true;
    // }
    // return false;

  }

  signup(email: string, password: string): Observable<void>{
    // const body = {email, name, password};

    const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password).then(() => {})

    return from(promise)

    // if(email && name && password){
    //   // this.save('registeredUser', body)
    //   // return true;
    // }

    

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
}
