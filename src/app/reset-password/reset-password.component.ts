import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {

  // STEP 1
  email = '';

  // STEP 2
  token = '';
  newPassword = '';

  // State
  tokenSent = false;
  isLoading = false;

  message = '';
  error = '';

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }

  // ================= REQUEST TOKEN =================
  async requestToken() {

    if (!this.email) {
      this.error = 'Email wajib diisi';
      return;
    }

    this.clearMsg();
    this.isLoading = true;

    try {

      await this.authService.requestResetPassword(this.email);

      this.tokenSent = true;
      this.message = 'Token sudah dikirim ke email';
      this.cdr.detectChanges();
    } catch {

      this.error = 'Gagal mengirim token';

    } finally {
      this.isLoading = false;
    }
  }

  // ================= RESET PASSWORD =================
  async resetPassword() {

    if (!this.token || !this.newPassword) {
      this.error = 'Semua field wajib diisi';
      return;
    }

    if (this.newPassword.length < 6) {
      this.error = 'Password minimal 6 karakter';
      return;
    }

    this.clearMsg();
    this.isLoading = true;

    try {

      await this.authService.resetPassword(
        this.token,
        this.newPassword
      );

      this.message = 'Password berhasil direset';

      // reset form
      this.email = '';
      this.token = '';
      this.newPassword = '';
      this.tokenSent = false;
      this.router.navigate(['/login']);
    } catch {

      this.error = 'Token tidak valid / expired';

    } finally {
      this.isLoading = false;
    }
  }

  // ================= RESET FORM =================
  resetForm() {
    this.tokenSent = false;
    this.token = '';
    this.newPassword = '';
    this.clearMsg();
  }

  clearMsg() {
    this.message = '';
    this.error = '';
  }
}
