import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, UserPlus } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  username = '';
  password = '';
  confirmPassword = '';
  email = '';
  nim = '';
  namaMahasiswa = '';

  error = '';
  success = '';
  isLoading = false;

  readonly UserPlus = UserPlus;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async handleRegister() {

    // VALIDASI
    if (!this.username || !this.password || !this.email || !this.nim || !this.namaMahasiswa) {
      this.error = 'Semua field wajib diisi';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Password tidak sama';
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password minimal 6 karakter';
      return;
    }

    this.error = '';
    this.success = '';
    this.isLoading = true;

    try {

      await this.authService.register({
        username: this.nim,
        password: this.password,
        email: this.email,
        nim: this.nim,
        namaMahasiswa: this.namaMahasiswa
      });

      this.success = 'Registrasi berhasil! Mengalihkan ke login...';

      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);

    } catch (err: any) {
      console.error('Register Error:', err);
      this.error = err?.error || 'Terjadi kesalahan saat registrasi';
    } finally {
      this.isLoading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
