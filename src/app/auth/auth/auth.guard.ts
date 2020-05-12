import { take, map } from 'rxjs/operators';
import { AuthService } from './../auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> | UrlTree {
        return this.authService.user.pipe(
            take(1),
            map(user => {
                const isAuth = user ? true : false;
                if (isAuth) {
                    return true;
                } else {
                    this.router.navigate(['/auth']);
                }
            }
            )
        );
    }
}
