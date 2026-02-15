import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Edit2, Trash2, Save, X } from 'lucide-angular';
import { KriteriaService } from '../../../services/kriteria.service';
import { KriteriaDto } from '../../../model';
import { TipeKriteria } from '../../../enum';
import { ChangeDetectorRef } from '@angular/core'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-criteria-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './criteria-management.component.html'
})
export class CriteriaManagementComponent implements OnInit {
  criteria: KriteriaDto[] = [];
  editingId: number | null = null;
  isAdding = false;

  // Agar Enum bisa dibaca di HTML
  readonly TipeKriteria = TipeKriteria;

  formData: KriteriaDto = {
    kode: '',
    namaKriteria: '',
    bobot: 0,
    tipe: TipeKriteria.BENEFIT // Default 1
  };

  // Icons ... (sama seperti sebelumnya)
  readonly Plus = Plus;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;
  readonly Save = Save;
  readonly X = X;

  constructor(private kriteriaService: KriteriaService, private cdr: ChangeDetectorRef, private toastr: ToastrService) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    try {
      const response: any = await this.kriteriaService.getAll();
      console.log('Response dari backend:', response);

      // Pastikan mapping data benar
      if (Array.isArray(response)) {
        this.criteria = [...response]; // Gunakan spread operator untuk trigger change detection
      } else if (response && response.data) {
        this.criteria = [...response.data];
      } else {
        this.criteria = [];
      }

      // Paksa Angular untuk mengecek perubahan data
      this.cdr.detectChanges();

    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  handleEdit(criterion: KriteriaDto) {
    this.editingId = criterion.id!;
    this.formData = { ...criterion };
    this.isAdding = false;
  }

  handleAdd() {
    this.isAdding = true;
    this.editingId = null;
    this.formData = {
      kode: '',
      namaKriteria: '',
      bobot: 0,
      tipe: TipeKriteria.BENEFIT // Default 1
    };
  }

  async handleSave() {
    if (!this.formData.kode || !this.formData.namaKriteria) {
      alert('Lengkapi data');
      return;
    }
    try {
      await this.kriteriaService.saveOrUpdate(this.formData);
      this.handleCancel();
      await this.loadData();
    } catch (error) {
      console.error('Save error:', error);
    }
  }

  async handleDelete(id?: number) {
    // Tambahkan pengecekan: Jika id tidak ada (undefined), stop proses
    if (!id) return;

    this.toastr.warning(
      'Klik untuk konfirmasi hapus',
      'Konfirmasi',
      {
        closeButton: true,
        timeOut: 5000,
        tapToDismiss: false,
        onActivateTick: true
      }
    ).onTap.subscribe(async () => {

      try {
        await this.kriteriaService.delete(id);
        this.toastr.success('Data berhasil dihapus', 'Sukses');
        await this.loadData();
        this.cdr.detectChanges();
      } catch (error) {
        this.toastr.error('Gagal menghapus data', 'Error');
      }

    });
  }

  handleCancel() {
    this.isAdding = false;
    this.editingId = null;
    this.formData = { kode: '', namaKriteria: '', bobot: 0, tipe: TipeKriteria.BENEFIT };
  }

  get totalWeight(): number {
    return this.criteria.reduce((sum, c) => sum + c.bobot, 0);
  }
}