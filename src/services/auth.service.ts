import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // 1. Tambah Inject & PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // 2. Tambah isPlatformBrowser
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthRequest, AuthResponse } from '../model';
import { User } from '../model/User';
import { RegisterRequest } from '../model/RegisterRequest';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;

    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;

    constructor(
        private http: HttpClient,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object // 3. Inject Platform ID
    ) {
        let storedUser = null;

        // 4. CEK: Apakah kita sedang di Browser?
        if (isPlatformBrowser(this.platformId)) {
            // Hanya akses localStorage jika di browser
            const storedData = localStorage.getItem('currentUser');
            if (storedData) {
                storedUser = JSON.parse(storedData);
            }
        }

        // Jika di server, storedUser tetap null (aman)
        this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    async login(request: AuthRequest): Promise<User> {
        const request$ = this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
            .pipe(map(response => {
                const role = request.username.includes('admin') ? 'admin' : 'user';

                const user: User = {
                    id: 'user-' + request.username,
                    name: request.username,
                    role: role as 'admin' | 'user',
                    token: response.token
                };

                // 5. Cek lagi saat menyimpan (Optional, tapi good practice)
                if (isPlatformBrowser(this.platformId)) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                }

                this.currentUserSubject.next(user);
                return user;
            }));

        return await firstValueFrom(request$);
    }

    async register(request: RegisterRequest): Promise<string> {

        const request$ = this.http.post(
            `${this.apiUrl}/register`,
            request,
            { responseType: 'text' }
        );

        return await firstValueFrom(request$);
    }

    logout() {
        // 6. Cek saat menghapus
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem('currentUser');
        }

        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return !!this.currentUserSubject.value;
    }

    getToken(): string | null {
        const user = this.currentUserSubject.value;
        return user && (user as any).token ? (user as any).token : null;
    }

    // ... (Method Reset Password tetap sama) ...
    async requestResetPassword(email: string): Promise<string> {
        const params = new HttpParams().set('email', email);
        const request$ = this.http.post(`${this.apiUrl}/reset-request`, null, {
            params, responseType: 'text'
        });
        return await firstValueFrom(request$);
    }

    async resetPassword(token: string, newPass: string): Promise<string> {
        const params = new HttpParams().set('token', token).set('newPassword', newPass);
        const request$ = this.http.post(`${this.apiUrl}/reset-password`, null, {
            params, responseType: 'text'
        });
        return await firstValueFrom(request$);
    }

    async getMahasiswaByNim(nim: string): Promise<any> {
        const url = `${environment.apiUrl}/mahasiswa/${nim}`;
        const request$ = this.http.get<any>(url);
        return await firstValueFrom(request$);
    }
}