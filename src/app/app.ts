import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Kita hanya butuh RouterOutlet
  templateUrl: './app.html', // Pastikan ini mengarah ke file yang isinya cuma <router-outlet>
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'spk-ti-fe';
  // HAPUS SEMUA logic currentUser, handleLogin, handleLogout dari sini.
  // Karena logic itu sudah pindah ke masing-masing halaman.
}