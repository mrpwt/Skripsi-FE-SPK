import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, BarChart3, Users, ClipboardList, TrendingUp } from 'lucide-angular';
import { SpkService } from '../../../services/spk.service';
import { AnalitikResponse } from '../../../model';
import { ChangeDetectorRef } from '@angular/core'; // Impor sesuai gaya kamu

@Component({
  selector: 'app-analytics-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './analytics-view.component.html'
})
export class AnalyticsViewComponent implements OnInit {
  analitikData?: AnalitikResponse;
  isLoading = true;

  // Icons registrasi
  readonly Users = Users;
  readonly BarChart3 = BarChart3;
  readonly ClipboardList = ClipboardList;
  readonly TrendingUp = TrendingUp;

  // Gunakan constructor injection sesuai dengan template kamu
  constructor(
    private spkService: SpkService, 
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadAnalytics();
  }

  async loadAnalytics() {
    try {
      this.isLoading = true;
      const response = await this.spkService.getAnalitikData();
      console.log('Response analitik dari backend:', response);

      if (response) {
        this.analitikData = response;
      }

      // Paksa Angular mengecek perubahan data (pola khas kamu)
      this.cdr.detectChanges();

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}