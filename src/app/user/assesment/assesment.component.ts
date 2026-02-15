import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Info, Save } from 'lucide-angular';
import { BidangService } from '../../../services/bidang.service';
import { KriteriaService } from '../../../services/kriteria.service';
import { SpkService } from '../../../services/spk.service';
import { BidangDto, KriteriaDto, PenilaianRequest, User } from '../../../model';
import { ChangeDetectorRef } from '@angular/core'
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assesment',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './assesment.component.html'
})
export class AssesmentComponent implements OnInit, OnChanges {
  readonly InfoIcon = Info;
  readonly SaveIcon = Save;

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

  constructor(
    private bidangService: BidangService,
    private kriteriaService: KriteriaService,
    private spkService: SpkService,
    private authService: AuthService,
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

  async onSubmit(): Promise<void> {
    try {
      this.isSubmitting = true;

      var nim = this.user?.name;

      // 🔥 Loop per bidang (karena backend 1 request = 1 bidang)
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

      // Setelah semua bidang tersimpan → hitung rekomendasi
      const hasil = await this.spkService.hitungRekomendasi(nim || '');

      console.log('Hasil Rekomendasi:', hasil);
      this.toastr.success('Rekomendasi berhasil dihitung!', 'Berhasil');
      this.submitForm.emit(hasil);  

    } catch (error) {
      console.error('Error submit:', error);
      this.toastr.error('Terjadi kesalahan saat memproses data', 'Error');
    } finally {
      this.isSubmitting = false;
    }
  }
}