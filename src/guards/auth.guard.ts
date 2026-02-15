import { Injectable } from '@angular/core';
import { 
  Router, 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot 
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // 1. Tanya ke AuthService: "User sudah login belum?"
        if (this.authService.isAuthenticated()) {
            // Jika SUDAH login, izinkan masuk (return true)
            return true;
        }

        // 2. Jika BELUM login:
        // Arahkan paksa ke halaman login
        this.router.navigate(['/login']);
        
        // Blokir akses ke halaman tujuan (return false)
        return false;
    }
}