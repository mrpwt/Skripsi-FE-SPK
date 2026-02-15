import { Component } from '@angular/core'; // Hapus Input, Output, EventEmitter
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../../services/auth.service'; // Import AuthService
import { User } from '../../model/User'; // Sesuaikan path import
import { 
  LucideAngularModule, 
  Settings, ClipboardList, FileQuestion, Users, BarChart3, LogOut 
} from 'lucide-angular';

// Import komponen child (Biarkan seperti semula)
import { CriteriaManagementComponent } from './criteria/criteria-management.component';
import { AlternativesManagementComponent } from './alternatives/alternatives-management.component';
import { AnalyticsViewComponent } from './analytics/analytics-view.component'; 
import { StudentsComponent } from './students/students.component';
import { TestManagementComponent } from './test-management/test-management.component';

type AdminTab = 'criteria' | 'alternatives' | 'test' | 'students' | 'analytics';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule, 
    LucideAngularModule,
    CriteriaManagementComponent,
    AlternativesManagementComponent,
    AnalyticsViewComponent,
    StudentsComponent,
    TestManagementComponent
  ],
  templateUrl: './admin.html', 
  styleUrl: './admin.css' 
})
export class AdminComponent { 
  // --- BAGIAN YANG DIUBAH ---
  
  // 1. Hapus @Input dan @Output
  // @Input({ required: true }) user!: User; 
  // @Output() onLogout = new EventEmitter<void>();

  user: User | null = null;
  activeTab: AdminTab = 'criteria';
  LogOutIcon = LogOut;

  tabs = [
    { id: 'criteria' as AdminTab, label: 'Kriteria', icon: Settings },
    { id: 'alternatives' as AdminTab, label: 'Bidang', icon: ClipboardList },
    { id: 'test' as AdminTab, label: 'Tes Kemampuan', icon: FileQuestion },
    { id: 'students' as AdminTab, label: 'Data Mahasiswa', icon: Users },
    { id: 'analytics' as AdminTab, label: 'Analitik', icon: BarChart3 }
  ];

  // 2. Inject AuthService & Router
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // 3. Ambil data user langsung dari Service saat halaman dibuka
    this.user = this.authService.currentUserValue;
  }

  setActiveTab(tab: AdminTab) {
    this.activeTab = tab;
  }

  // 4. Buat fungsi logout sendiri
  handleLogout() {
    this.authService.logout();
    // Redirect akan ditangani oleh logic di dalam AuthService
  }
}