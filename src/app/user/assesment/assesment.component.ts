import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Info, Save, BookOpen, X } from 'lucide-angular';
import { BidangService } from '../../../services/bidang.service';
import { KriteriaService } from '../../../services/kriteria.service';
import { SpkService } from '../../../services/spk.service';
import { BidangDto, KriteriaDto, MataKuliahDto, PenilaianRequest, User } from '../../../model';
import { ChangeDetectorRef } from '@angular/core'
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MataKuliahService } from '../../../services/mata-kuliah.service';

@Component({
  selector: 'app-assesment',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './assesment.component.html'
})
export class AssesmentComponent implements OnInit, OnChanges {
  readonly InfoIcon = Info;
  readonly SaveIcon = Save;
  readonly BookOpenIcon = BookOpen;
  readonly XIcon = X;

  @Input() nim!: string;
  @Input() testResults: any[] = [];
  @Input() testCompleted: boolean = false;
  @Output() submitForm = new EventEmitter<any>();

  criteria: KriteriaDto[] = [];
  alternatives: BidangDto[] = [];
  values: { [bidangId: number]: { [kriteriaId: number]: number } } = {};
  isLoading = true;
  isSubmitting = false;
  user: User | null = null;

  isC1ModalOpen = false;
  selectedBidangIdForModal: number | null = null;
  selectedKriteriaIdForModal: number | null = null;
  selectedBidangName = '';
  modalCourses: MataKuliahDto[] = [];
  courseRatings: { [courseId: number]: number } = {};
  minatValues = {
    rpl: 0,
    ai: 0,
    jarkom: 0
  };

  constructor(
    private bidangService: BidangService,
    private kriteriaService: KriteriaService,
    private spkService: SpkService,
    private authService: AuthService,
    private mataKuliahService: MataKuliahService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  // 3. Pastikan fungsi ini terpanggil saat testResults dikirim dari Parent
  ngOnChanges(changes: SimpleChanges) {
    if ((changes['testResults'] || changes['testCompleted']) && this.alternatives.length > 0) {
      console.log('Update terdeteksi, mengisi ulang C3...');
      this.initializeForm();
    }
  }

  async ngOnInit() {
    this.user = this.authService.currentUserValue;
    await this.loadData();
  }

  async loadData() {
    try {
      const [bidangRes, kriteriaRes] = await Promise.all([
        this.bidangService.getAll(),
        this.kriteriaService.getAll()
      ]);
      this.alternatives = bidangRes;
      this.criteria = kriteriaRes;

      this.initializeForm();
      this.isLoading = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading assessment data:', error);
      this.isLoading = false;
    }
  }

  initializeForm(): void {
    const initialValues: any = {};

    this.alternatives.forEach(alt => {
      const bidangId = alt.id!;
      initialValues[bidangId] = {};

      this.criteria.forEach(crit => {
        const kriteriaId = crit.id!;
        const kodeKriteria = this.getCritCode(crit);

        if (kodeKriteria === 'C3' && this.testCompleted) {
          // Gunakan pencarian yang mencakup bidangId
          const result = this.testResults.find(r => Number(r.bidangId) === Number(bidangId));

          if (result) {
            // Langsung ambil nilai percentage
            initialValues[bidangId][kriteriaId] = result.percentage || 0;
            console.log(`Berhasil mengisi C3: ${result.percentage}`);
          } else {
            initialValues[bidangId][kriteriaId] = 0;
          }
        } else {
          initialValues[bidangId][kriteriaId] = this.values[bidangId]?.[kriteriaId] || 0;
        }
      });
    });

    this.values = initialValues;
    this.cdr.detectChanges();
  }

  // Tambahkan di dalam class AssesmentComponent

  // Fungsi untuk mendapatkan kode kriteria (C1, C2, dst) secara aman
  getCritCode(crit: any): string {
    return crit?.kode || crit?.kodeKriteria || '';
  }

  // Fungsi untuk mengecek apakah ini kriteria C3 (Bakat)
  isC3(crit: any): boolean {
    return this.getCritCode(crit) === 'C3';
  }

  isC2(crit: any): boolean {
    return this.getCritCode(crit) === 'C2';
  }

  // --- FUNGSI BARU UNTUK CEK KRITERIA C1 ---
  isC1(crit: any): boolean {
    return this.getCritCode(crit) === 'C1';
  }

  // --- FUNGSI UNTUK MEMBUKA MODAL C1 ---
  async openC1Modal(bidangId: number, kriteriaId: number, bidangName: string) {
    this.selectedBidangIdForModal = bidangId;
    this.selectedKriteriaIdForModal = kriteriaId;
    this.selectedBidangName = bidangName;
    this.courseRatings = {}; // Reset input nilai temporary

    try {
      // Ambil mata kuliah berdasarkan bidangId yang dipilih dari backend
      const res = await this.mataKuliahService.getByBidangId(bidangId);
      this.modalCourses = res || [];

      if (this.modalCourses.length === 0) {
        this.toastr.info('Belum ada master data mata kuliah pendukung untuk bidang ini.', 'Informasi');
        return;
      }

      // Inisialisasi nilai form input default 0
      this.modalCourses.forEach(c => {
        this.courseRatings[c.id!] = 0;
      });

      this.isC1ModalOpen = true;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading modal courses:', error);
      this.toastr.error('Gagal memuat mata kuliah pendukung', 'Error');
    }
  }

  // --- FUNGSI UNTUK MENGHITUNG RATA-RATA & MENGISI C1 ---
  saveC1Value() {
    if (!this.selectedBidangIdForModal || !this.selectedKriteriaIdForModal) return;

    let totalScore = 0;
    const totalCourses = this.modalCourses.length;

    this.modalCourses.forEach(c => {
      totalScore += this.courseRatings[c.id!] || 0;
    });

    // Cari rata-rata pembulatan nilai
    const averageScore = totalCourses > 0 ? Math.round(totalScore / totalCourses) : 0;

    // Set nilai kriteria C1 pada bidang terkait
    this.values[this.selectedBidangIdForModal][this.selectedKriteriaIdForModal] = averageScore;

    this.isC1ModalOpen = false;
    this.toastr.success(`Nilai akademik C1 untuk bidang ${this.selectedBidangName} berhasil dikalkulasi!`, 'Sukses');
    this.cdr.detectChanges();
  }

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;
      var nim = this.user?.name;

      for (const bidangId in this.values) {
        const detailPenilaian = [];
        for (const kriteriaId in this.values[bidangId]) {
          detailPenilaian.push({
            kriteriaId: Number(kriteriaId),
            nilai: this.values[bidangId][kriteriaId]
          });
        }

        const payload = {
          nim: nim,
          bidangId: Number(bidangId),
          penilaian: detailPenilaian
        };

        await this.spkService.savePenilaianBulk(payload);
      }

      const hasil = await this.spkService.hitungRekomendasi(nim || '');
      console.log('Hasil Rekomendasi:', hasil);
      this.toastr.success('Rekomendasi berhasil dihitung!', 'Berhasil');
      this.submitForm.emit(hasil);

    } catch (error) {
      console.error('Error submit:', error);
      this.toastr.error('Terjadi kesalahan saat memproses data(Nilai Wajib Di isi semua)', 'Error');
    } finally {
      this.isSubmitting = false;
    }
  }

  getRemainingQuota(currentBidangId: number, currentKriteriaId: number): number {
    let totalUsed = 0;

    // Hitung total nilai C2 yang sudah diisi di bidang (alternatif) lain
    this.alternatives.forEach(alt => {
      const bidangId = alt.id!;
      if (bidangId !== currentBidangId && this.values[bidangId]) {
        totalUsed += this.values[bidangId][currentKriteriaId] || 0;
      }
    });

    const sisa = 100 - totalUsed;
    return sisa < 0 ? 0 : sisa;
  }

  onSliderChange(bidangId: number, kriteriaId: number, value: any): void {
    if (value === null || value === undefined || value === '') {
      this.values[bidangId][kriteriaId] = 0;
      return;
    }

    let parsedValue = Number(value);

    // Jika input bukan angka valid, amankan ke 0
    if (isNaN(parsedValue)) {
      this.values[bidangId][kriteriaId] = 0;
      return;
    }

    if (parsedValue > 100) {
      parsedValue = 100;
    } else if (parsedValue < 0) {
      parsedValue = 0;
    }

    this.values[bidangId][kriteriaId] = Math.round(parsedValue);
    this.cdr.detectChanges(); // Paksa UI memperbarui tampilan slider agar ikut mundur ke posisi 100
  }

  onCourseRatingChange(courseId: number, value: any): void {
    // Jika kolom input kosong (dihapus habis oleh user), set ke 0
    if (value === null || value === undefined || value === '') {
      this.courseRatings[courseId] = 0;
      return;
    }

    let parsedValue = Number(value);

    // Antisipasi jika hasil konversi bukan angka
    if (isNaN(parsedValue)) {
      this.courseRatings[courseId] = 0;
      return;
    }

    // Sebagai lapis kedua, potong nilai jika melebihi batas aman 0-100
    if (parsedValue > 100) {
      parsedValue = 100;
    } else if (parsedValue < 0) {
      parsedValue = 0;
    }

    this.courseRatings[courseId] = Math.round(parsedValue);
    this.cdr.detectChanges();
  }
}