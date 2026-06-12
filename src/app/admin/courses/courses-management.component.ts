import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Pencil, Trash2, Save, X } from 'lucide-angular';
import { MataKuliahService } from '../../../services/mata-kuliah.service'; 
import { BidangService } from '../../../services/bidang.service';         
import { MataKuliahDto, BidangDto } from '../../../model';                
import { ChangeDetectorRef } from '@angular/core';                        // 1. Import CDR
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-courses-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './courses-management.component.html',
  styleUrls: ['./courses-management.component.css']
})
export class CoursesManagementComponent implements OnInit {
  // Icon Lucide
  readonly PlusIcon = Plus;
  readonly PencilIcon = Pencil;
  readonly TrashIcon = Trash2;
  readonly SaveIcon = Save;
  readonly XIcon = X;

  // State Data
  courses: MataKuliahDto[] = [];
  alternatives: BidangDto[] = []; // Menampung data Master Bidang untuk Dropdown Select
  isLoading = true;
  isModalOpen = false;

  // Form State
  modalTitle = 'Tambah Mata Kuliah';
  formCourse: MataKuliahDto = {
    id: undefined,
    bidangId: 0,
    namaMataKuliah: ''
  };

  // 2. Inject ChangeDetectorRef di dalam constructor
  constructor(
    private mataKuliahService: MataKuliahService,
    private bidangService: BidangService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    await this.loadInitialData();
  }

  async loadInitialData() {
    this.isLoading = true;
    this.cdr.detectChanges(); // Paksa spinner loading muncul langsung

    try {
      // Ambil data mata kuliah dan master bidang secara paralel
      const [coursesRes, bidangRes] = await Promise.all([
        this.mataKuliahService.getAll(),
        this.bidangService.getAll()
      ]);

      // Amankan data ke dalam state dengan spread operator
      this.courses = Array.isArray(coursesRes) ? [...coursesRes] : [];
      this.alternatives = Array.isArray(bidangRes) ? [...bidangRes] : [];

    } catch (error) {
      console.error('Error loading data:', error);
      this.toastr.error('Gagal memuat data dari server', 'Error');
    } finally {
      this.isLoading = false;
      // 3. Paksa Angular mendeteksi perubahan state setelah async selesai
      this.cdr.detectChanges(); 
    }
  }

  // Helper untuk mendapatkan Nama Bidang di baris tabel berdasarkan bidangId
  getBidangName(bidangId: number): string {
    const bidang = this.alternatives.find(b => b.id === bidangId);
    return bidang ? bidang.namaBidang : 'Tidak Diketahui';
  }

  // Buka Modal Form (Mode Tambah)
  openAddModal() {
    this.modalTitle = 'Tambah Mata Kuliah Baru';
    this.formCourse = {
      id: undefined,
      bidangId: this.alternatives.length > 0 ? this.alternatives[0].id! : 0, // Default select ke bidang pertama
      namaMataKuliah: ''
    };
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  // Buka Modal Form (Mode Edit)
  openEditModal(course: MataKuliahDto) {
    this.modalTitle = 'Ubah Mata Kuliah';
    this.formCourse = { ...course }; // Clone data agar tidak mutasi langsung di tabel
    this.isModalOpen = true;
    this.cdr.detectChanges();
  }

  // Aksi simpan Form (Menangani Create & Update sekaligus)
  async onSubmit() {
    if (!this.formCourse.namaMataKuliah.trim() || !this.formCourse.bidangId) {
      this.toastr.warning('Semua data form wajib diisi!', 'Peringatan');
      return;
    }

    try {
      await this.mataKuliahService.saveOrUpdate(this.formCourse);
      this.toastr.success('Mata kuliah berhasil disimpan!', 'Sukses');
      this.isModalOpen = false;
      await this.loadInitialData(); // Di dalam fungsi ini sudah ada cdr.detectChanges()
    } catch (error) {
      console.error('Error saving data:', error);
      this.toastr.error('Gagal menyimpan data mata kuliah', 'Error');
    }
  }

  // Aksi Hapus Mata Kuliah Menggunakan Toastr Konfirmasi (Sinkron dengan gaya Komponen Kriteria)
  async onDelete(id?: number) {
    if (!id) return;

    this.toastr.warning(
      'Klik untuk konfirmasi hapus mata kuliah',
      'Konfirmasi',
      {
        closeButton: true,
        timeOut: 5000,
        tapToDismiss: false,
        onActivateTick: true
      }
    ).onTap.subscribe(async () => {
      try {
        await this.mataKuliahService.delete(id);
        this.toastr.success('Mata kuliah berhasil dihapus', 'Sukses');
        await this.loadInitialData();
      } catch (error) {
        console.error('Error deleting data:', error);
        this.toastr.error('Gagal menghapus mata kuliah', 'Error');
      }
    });
  }
}