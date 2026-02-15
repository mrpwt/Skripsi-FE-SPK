import { Component } from '@angular/core'; // Hapus Input, Output, EventEmitter
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { User } from '../../model/User';
import { TestResult } from '../../models/test';
import { ChangeDetectorRef } from '@angular/core';

// Import Child Components
import { TestComponent } from './test/test.component';
import { AssesmentComponent } from './assesment/assesment.component';
import { RecommendationResultComponent } from './recommendation-result/recommendation-result.component';
import { SpkService } from '../../services/spk.service';
import { BidangService } from '../../services/bidang.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    TestComponent,
    AssesmentComponent,
    RecommendationResultComponent
  ],
  templateUrl: './user.html'
})
export class UserComponent {
  // --- BAGIAN YANG DIUBAH ---

  // 1. Hapus @Input dan @Output karena tidak dipakai di Routing
  // @Input() user: User | null = null;
  // @Output() onLogout = new EventEmitter<void>();

  user: User | null = null; // Variable lokal
  activeTab: 'test' | 'assessment' | 'results' = 'test';
  mahasiswa: any;

  sudahPernahTes: boolean = false;
  hasStarted: boolean = false;
  hasSubmitted = false;
  testCompleted = false;
  testResults: TestResult[] = [];
  hasilRekomendasi: any[] = [];
  nameBidang: any;

  // 2. Inject AuthService dan Router
  constructor(
    private authService: AuthService,
    private spkService: SpkService,
    private bidangService: BidangService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // 3. Ambil data user langsung dari Service
    this.user = this.authService.currentUserValue;
  }
  async ngOnInit() {
    await this.loadMahasiswa();
    await this.cekHasilRekomendasi();
  }

  handleTestComplete(results: TestResult[]) {
    this.testResults = results;
    this.testCompleted = true;
    this.activeTab = 'assessment';
  }

  // Fungsi validasi perpindahan tab
  changeTab(targetTab: 'test' | 'assessment' | 'results') {
    // Kalau sudah pernah tes → bebas pindah
    this.hasStarted = true;

    if (this.sudahPernahTes) {
      this.activeTab = targetTab;
      return;
    }
    
    // Jika mencoba ke tab assessment atau results tapi belum tes
    if ((targetTab === 'assessment' || targetTab === 'results') && !this.testCompleted) {
      alert('Anda wajib menyelesaikan "Tes Kemampuan" terlebih dahulu!');
      this.activeTab = 'test';
      return;
    }

    // Jika mencoba ke tab results tapi belum mengisi form penilaian
    if (targetTab === 'results' && !this.hasSubmitted) {
      alert('Anda wajib mengisi "Formulir Penilaian" terlebih dahulu!');
      this.activeTab = 'assessment';
      return;
    }

    this.activeTab = targetTab;
  }

  handleAssessmentSubmit(hasil: any[]) {
    this.hasSubmitted = true;
    this.hasSubmitted = true;
    this.hasSubmitted = true;

    this.hasilRekomendasi = hasil;
    this.activeTab = 'results';
  }

  startTest() {
    this.hasStarted = true;
    this.activeTab = 'test';
  }

  async loadMahasiswa() {
    try {
      this.mahasiswa = await this.authService.getMahasiswaByNim(this.user?.name || '');
      console.log(this.mahasiswa);
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Gagal ambil data mahasiswa', err);
    }
  }

  async cekHasilRekomendasi() {
    var nim = this.mahasiswa.nim;
    try {
      const hasil = await this.spkService.hitungRekomendasi(nim);

      // Jika sudah ada hasil
      if (hasil && hasil.length > 0) {

        this.hasilRekomendasi = hasil;

        this.testCompleted = true;
        this.hasSubmitted = true;

        // FLAG: sudah pernah tes
        this.sudahPernahTes = true;

        // Aktifkan semua tab
        this.activeTab = 'results';
        console.log('Sudah pernah tes:', hasil);
        this.nameBidang = await this.bidangService.getById(hasil[0].bidangId);
        console.log('Nama bidang dari hasil rekomendasi:', this.nameBidang.namaBidang);
      }
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Belum ada hasil / error:', err);
    }
  }

  ulangTest() {

    // Reset semua status
    this.sudahPernahTes = false;
    this.testCompleted = false;
    this.hasSubmitted = false;
    this.hasStarted = false;

    this.testResults = [];
    this.hasilRekomendasi = [];

    // Kembali ke tab test
    this.activeTab = 'test';
  }


  // 4. Perbaiki fungsi Logout
  logout() {
    // Panggil service untuk hapus token/session
    this.authService.logout();

    // Redirect biasanya sudah dihandle di service, 
    // tapi jika tidak, bisa tambahkan: this.router.navigate(['/login']);
  }
}