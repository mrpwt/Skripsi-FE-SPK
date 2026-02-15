import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; 
import { LucideAngularModule, GraduationCap } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AuthRequest } from '../../model/AuthRequest';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  isLoading = false;

  readonly GraduationCap = GraduationCap;

  constructor(
    private authService: AuthService,
    private router: Router 
  ) {
    // === PERBAIKAN 1: Auto Redirect di Constructor ===
    // Cek user yang tersimpan di memori/storage
    const currentUser = this.authService.currentUserValue;
    
    if (currentUser) {
      // Jika sudah login, arahkan sesuai role
      if (currentUser.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/user']);
      }
    }
  }

  async handleSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Username dan password wajib diisi';
      return;
    }

    this.error = '';
    this.isLoading = true;

    try {
      const request: AuthRequest = {
        username: this.username,
        password: this.password
      };

      // 1. Panggil Service dan TAMPUNG data user yang dikembalikan
      const user = await this.authService.login(request);

      // === PERBAIKAN 2: Logic Redirect setelah Login ===
      // Jangan ke /dashboard, tapi cek role user
      if (user.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/user']);
      }

    } catch (err: any) {
      console.error('Login Error:', err);
      if (err.status === 401) {
        this.error = 'Username atau password salah';
      } else {
        this.error = 'Terjadi kesalahan pada server.';
      }
    } finally {
      this.isLoading = false;
    }
  }
}