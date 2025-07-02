import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCE4i1wqaNvrdzTsxipxX8e0kQinAZMEWk",
  authDomain: "digital-products-store-91a94.firebaseapp.com",
  projectId: "digital-products-store-91a94",
  storageBucket: "digital-products-store-91a94.firebasestorage.app",
  messagingSenderId: "720708423114",
  appId: "1:720708423114:web:819e95f728c0d1815ad333"
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(withFetch()),
    // importProvidersFrom([
    //   provideFirebaseApp(() => initializeApp(firebaseConfig)),
    //   provideFirestore(() => getFirestore())
    // ])
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ],
};
