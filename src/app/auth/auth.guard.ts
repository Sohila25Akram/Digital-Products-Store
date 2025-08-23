import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AuthService } from "../shared/services/auth.service";
import { map } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate{
    private authService = inject(AuthService);
    private router = inject(Router);

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
        return this.authService.isAuthenticated().pipe(
            map(isAuth => {
            if (isAuth) {
                return true;
            } else {
                return this.router.createUrlTree(['/auth']);
            }
            })
        );
    }
}