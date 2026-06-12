import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Edit2, Trash2, Save, X, Search } from 'lucide-angular';
import { SoalTestService } from '../../../services/soal-test.service';
import { BidangService } from '../../../services/bidang.service';
import { SoalTestDto, BidangDto } from '../../../model';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core'

@Component({
  selector: 'app-test-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './test-management.component.html'
})
export class TestManagementComponent implements OnInit {
  questions: SoalTestDto[] = [];
  alternatives: BidangDto[] = []; // Data Bidang dari API
  editingId: number | null = null;
  isAdding = false;

  searchKeyword: string = '';
  selectedBidangFilter: number | null = null;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  totalSoalUjian: number = 15;

  formData: SoalTestDto = this.resetForm();

  readonly Plus = Plus;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;
  readonly Save = Save;
  readonly X = X;
  readonly Search = Search;

  constructor(
    private soalService: SoalTestService,
    private bidangService: BidangService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      // Ambil data bidang terlebih dahulu untuk keperluan dropdown filter
      this.alternatives = await this.bidangService.getAll();
      await this.loadQuestions();
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  // Method khusus memanggil data soal berdasarkan state filter & page saat ini
  async loadQuestions() {
    try {
      const pageData = await this.soalService.getAllAdmin(
        this.searchKeyword,
        this.selectedBidangFilter,
        this.currentPage,
        this.pageSize
      );

      // Ambil array konten utama dari object Page Spring Boot
      this.questions = pageData.content || [];
      this.totalPages = pageData.totalPages || 0;
      this.totalElements = pageData.totalElements || 0;

      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  }

  // Fungsi trigger ketika mengetik di kolom pencarian atau ganti dropdown filter
  onFilterChange() {
    this.currentPage = 0; // Kembalikan ke halaman pertama setiap kali filter berubah
    this.loadQuestions();
  }

  // Navigasi Halaman
  async goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      await this.loadQuestions();
    }
  }

  async saveUjianConfig() {
    if (this.totalSoalUjian < this.alternatives.length) {
      this.toastr.warning(`Minimal soal adalah ${this.alternatives.length} agar tiap bidang kebagian rata!`, 'Peringatan');
      return;
    }

    try {
      await this.soalService.updateConfigJumlahSoal(this.totalSoalUjian);
      this.toastr.success('Konfigurasi live total soal ujian berhasil diperbarui di database!', 'Sukses');
    } catch (error: any) {
      console.error('Error saving config:', error);
      this.toastr.error('Gagal menyimpan konfigurasi', 'Error');
      // Validasi stok bank soal 1.5x dilempar ke toastr error
      if (error.error && typeof error.error === 'string') {
        this.toastr.error(error.error, 'Gagal Konfigurasi'); 
      } else {
        this.toastr.error('Gagal mengubah konfigurasi. Pastikan total ketersediaan bank soal mencukupi aturan 1.5x kebutuhan.', 'Error');
      }
    }
  }

  resetForm(): SoalTestDto {
    return {
      pertanyaan: '',
      opsi: { A: '', B: '', C: '', D: '' }, // opsi as object with keys A-D
      jawabanBenar: 'A',
      bidangId: 0
    };
  }

  handleEdit(question: SoalTestDto) {
    this.editingId = question.id!;
    this.formData = JSON.parse(JSON.stringify(question)); // Copy nested object opsi
    this.isAdding = false;
  }

  handleAdd() {
    this.isAdding = true;
    this.editingId = null;
    this.formData = this.resetForm();
    if (this.alternatives.length > 0) {
      this.formData.bidangId = this.alternatives[0].id ?? 0;
    }
  }

  async handleSave() {
    try {
      await this.soalService.saveOrUpdate(this.formData);
      this.handleCancel();
      await this.loadQuestions();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Save error:', error);
      this.toastr.error('Gagal menyimpan soal', 'Error');
    }
  }

  async handleDelete(id?: number) {
    if (!id) return;
    if (confirm('Hapus soal ini?')) {
      try {
        await this.soalService.delete(id);
        await this.loadQuestions();
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  }

  handleCancel() {
    this.isAdding = false;
    this.editingId = null;
    this.formData = this.resetForm();
  }

  getBidangName(id?: number): string {
    const bidang = this.alternatives.find(a => a.id === id);
    return bidang ? (bidang.namaBidang || 'Unknown') : 'N/A';
  }
}