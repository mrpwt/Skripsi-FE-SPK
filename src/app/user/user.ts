import { Component } from '@angular/core'; // Hapus Input, Output, EventEmitter
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { User } from '../../model/User';
import { TestResult } from '../../model/test';
import { ChangeDetectorRef } from '@angular/core';

// Import Child Components
import { TestComponent } from './test/test.component';
import { AssesmentComponent } from './assesment/assesment.component';
import { RecommendationResultComponent } from './recommendation-result/recommendation-result.component';
import { SpkService } from '../../services/spk.service';
import { BidangService } from '../../services/bidang.service';
import { BidangDto } from '../../model';
import { ToastrService } from 'ngx-toastr';

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
  listHistory: any[] = [];
  alternatives: BidangDto[] = [];

  // 2. Inject AuthService dan Router
  constructor(
    private authService: AuthService,
    private spkService: SpkService,
    private bidangService: BidangService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    // 3. Ambil data user langsung dari Service
    this.user = this.authService.currentUserValue;
  }
  async ngOnInit() {
    await this.loadMahasiswa();
    await this.loadMasterBidang();
    await this.cekHasilRekomendasi();
    await this.loadHistoryPenilaian();
  }

  async loadMasterBidang() {
    try {
      this.alternatives = await this.bidangService.getAll();
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Gagal memuat master data bidang:', err);
    }
  }

  getBidangName(id: any): string {
    if (!id) return 'N/A';
    const numericId = Number(id);
    const bidang = this.alternatives.find(a => Number(a.id) === numericId);
    return bidang ? (bidang.namaBidang || 'Tanpa Nama') : 'Bidang Tidak Diketahui';
  }

  async loadHistoryPenilaian() {
    if (!this.mahasiswa?.nim) return;
    try {
      const res = await this.spkService.getHistoryPenilaian(this.mahasiswa.nim);
      // Lakukan mapping parsing JSON data string detail_skor agar dibaca sebagai object array di template html
      this.listHistory = res.map(h => {
        return {
          ...h,
          detailSkorParsed: JSON.parse(h.detailSkor),
          isExpanded: false // State helper penunjuk fitur expand/collapse card
        };
      });
      this.cdr.detectChanges();
    } catch (err) {
      console.error('Gagal memuat histori penilaian:', err);
    }
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
      this.toastr.warning('Anda wajib menyelesaikan "Tes Kemampuan" terlebih dahulu!', 'Warning');
      this.activeTab = 'test';
      return;
    }

    // Jika mencoba ke tab results tapi belum mengisi form penilaian
    if (targetTab === 'results' && !this.hasSubmitted) {
      this.toastr.warning('Anda wajib mengisi "Formulir Penilaian" terlebih dahulu!', 'Warning');
      this.activeTab = 'assessment';
      return;
    }

    this.activeTab = targetTab;
  }

  async handleAssessmentSubmit(hasil: any[]) {
    this.hasSubmitted = true;
    this.hasSubmitted = true;
    this.hasSubmitted = true;

    this.hasilRekomendasi = hasil;
    this.activeTab = 'results';
    await this.loadHistoryPenilaian();
  }

  toggleExpand(item: any) {
    item.isExpanded = !item.isExpanded;
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
      const hasil = await this.spkService.getHasilAktif(nim);

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

  getKriteriaKeys(normalizedValues: any): string[] {
    if (!normalizedValues) return [];
    return Object.keys(normalizedValues).sort();
  }

  cetakPdf(historyId: number, nim: string): void {
    this.spkService.downloadRaportPdf(historyId).subscribe({
      next: (response: Blob) => {
        // Membuat URL objek dari blob PDF yang diterima
        const blobUrl = window.URL.createObjectURL(response);

        // Membuat elemen jangkar (<a>) tak terlihat di memori browser
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `Raport_SPK_${nim}.pdf`; // Nama file saat diunduh

        // Simulasikan klik untuk memulai unduhan otomatis
        link.click();

        // Bersihkan memori blob setelah selesai digunakan
        window.URL.revokeObjectURL(blobUrl);
      },
      error: (err) => {
        console.error('Gagal mengunduh PDF:', err);
        this.toastr.error('Gagal mencetak raport PDF. Silakan coba lagi nanti.', 'Error');
      }
    });
  }

  // Fungsi pembantu Anda yang sudah ada sebelumnya
  getBidangNamePdf(id: number): string {
    const nama: { [key: number]: string } = {
      1: 'Rekayasa Perangkat Lunak',
      2: 'Artificial Intelligence',
      3: 'Jaringan Komputer'
    };
    return nama[id] || 'Bidang';
  }

  getKriteriaKeysPdf(obj: any): string[] {
    return obj ? Object.keys(obj).sort() : [];
  }

  getRankFromHistory(current: any, allScores: any[]): number {
    const higherScores = allScores.filter(
      x => Number(x.skorAkhir) > Number(current.skorAkhir)
    ).length;

    return higherScores + 1;
  }

  isTieHistory(current: any, allScores: any[]): boolean {
    return allScores.filter(
      x => Number(x.skorAkhir) === Number(current.skorAkhir)
    ).length > 1;
  }

  hasTieInHistory(scores: any[]): boolean {
    if (!scores || scores.length === 0) {
      return false;
    }

    const maxScore = Math.max(
      ...scores.map(x => Number(x.skorAkhir))
    );

    return scores.filter(
      x => Number(x.skorAkhir) === maxScore
    ).length > 1;
  }
}