import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasilRekomendasiDto, BidangDto } from '../../../model';
import { BidangService } from '../../../services/bidang.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-recommendation-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recommendation-result.component.html'
})
export class RecommendationResultComponent {

  private _results: HasilRekomendasiDto[] = [];
  private isLoading = false;

  bidangMap: { [key: number]: string } = {};

  constructor(private bidangService: BidangService, private cdr: ChangeDetectorRef) {}

  @Input()
  set results(value: HasilRekomendasiDto[]) {
    this._results = value || [];

    if (this._results.length > 0) {
      this.loadBidangNames();
    } else {
      this.bidangMap = {};
    }
  }

  get results(): HasilRekomendasiDto[] {
    return this._results;
  }

  async loadBidangNames() {
    try {
      this.isLoading = true;

      const uniqueIds = [...new Set(this._results.map(r => r.bidangId))];

      // 🔥 Jalankan paralel, bukan satu-satu
      const bidangList: BidangDto[] = await Promise.all(
        uniqueIds.map(id => this.bidangService.getById(id))
      );

      // Reset map supaya tidak menyimpan data lama
      this.bidangMap = {};

      bidangList.forEach(bidang => {
        this.bidangMap[bidang.id!] = bidang.namaBidang;
      });
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error loading bidang names:', error);
    } finally {
      this.isLoading = false;
    }
  }

  getBidangName(id: number): string {
    return this.bidangMap[id] || 'Loading...';
  }

  getPercentage(score: number): number {
    if (!this._results.length) return 0;

    const maxScore = this._results[0]?.skorAkhir || 0;
    if (maxScore === 0) return 0;

    return (score / maxScore) * 100;
  }
}
