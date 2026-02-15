import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Plus, Edit2, Trash2, Save, X } from 'lucide-angular';
import { SoalTestService } from '../../../services/soal-test.service';
import { BidangService } from '../../../services/bidang.service';
import { SoalTestDto, BidangDto } from '../../../model';
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

  formData: SoalTestDto = this.resetForm();

  readonly Plus = Plus;
  readonly Edit2 = Edit2;
  readonly Trash2 = Trash2;
  readonly Save = Save;
  readonly X = X;

  constructor(
    private soalService: SoalTestService,
    private bidangService: BidangService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadInitialData();
  }

  async loadInitialData() {
    try {
      // Ambil data soal dan data bidang secara paralel
      const [soalRes, bidangRes] = await Promise.all([
        this.soalService.getAll(),
        this.bidangService.getAll()
      ]);
      this.questions = soalRes;
      this.alternatives = bidangRes;
      this.cdr.detectChanges(); 
    } catch (error) {
      console.error('Error loading data:', error);
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
      const soalRes = await this.soalService.getAll();
      this.questions = soalRes;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Save error:', error);
      alert('Gagal menyimpan soal');
    }
  }

  async handleDelete(id?: number) {
    if (!id) return;
    if (confirm('Hapus soal ini?')) {
      try {
        await this.soalService.delete(id);
        const soalRes = await this.soalService.getAll();
        this.questions = soalRes;
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