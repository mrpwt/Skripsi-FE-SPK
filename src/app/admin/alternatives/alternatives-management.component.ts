import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Edit2, Trash2, Save, X } from 'lucide-angular';
import { BidangService } from '../../../services/bidang.service';
import { BidangDto } from '../../../model';
import { ChangeDetectorRef } from '@angular/core'

@Component({
  selector: 'app-alternatives-management',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './alternatives-management.component.html'
})
export class AlternativesManagementComponent implements OnInit {
  alternatives: BidangDto[] = [];
  editingId: number | null = null;
  isAdding = false;

  formData: BidangDto = {
    kode: '',
    namaBidang: '',
    deskripsi: ''
  };

  // Icons
  readonly Plus = Plus;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;
  readonly Save = Save;
  readonly X = X;

  constructor(private bidangService: BidangService, private cdr: ChangeDetectorRef) { }

  // alternatives-management.component.ts
  ngOnInit() {
    this.loadData(); // Ini wajib ada agar data muncul saat pindah page
  }

  async loadData() {
    try {
      const response = await this.bidangService.getAll();
      console.log('Cek data bidang:', response); // Cek di console apakah data muncul

      if (response) {
        this.alternatives = response;
      }
      this.cdr.detectChanges(); 
    } catch (error) {
      console.error('Gagal mengambil data bidang:', error);
    }
  }

  handleEdit(alternative: BidangDto) {
    this.editingId = alternative.id!;
    this.formData = { ...alternative };
    this.isAdding = false;
  }

  handleAdd() {
    this.isAdding = true;
    this.editingId = null;
    this.formData = {
      kode: '',
      namaBidang: '',
      deskripsi: ''
    };
  }

  async handleSave() {
    if (!this.formData.kode || !this.formData.namaBidang) {
      alert('Kode dan Nama wajib diisi');
      return;
    }

    try {
      await this.bidangService.save(this.formData);
      this.handleCancel();
      await this.loadData();
    } catch (error) {
      console.error('Error saving bidang:', error);
      alert('Gagal menyimpan data');
    }
  }

  async handleDelete(id?: number) {
    if (!id) return;
    if (confirm('Apakah Anda yakin ingin menghapus bidang ini?')) {
      try {
        await this.bidangService.delete(id);
        await this.loadData();
      } catch (error) {
        console.error('Error deleting bidang:', error);
      }
    }
  }

  handleCancel() {
    this.isAdding = false;
    this.editingId = null;
    this.formData = { kode: '', namaBidang: '', deskripsi: '' };
  }
}