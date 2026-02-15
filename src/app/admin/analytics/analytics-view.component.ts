import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, BarChart3, Users, ClipboardList, TrendingUp } from 'lucide-angular';
import { mockStudentAssessments, defaultCriteria, defaultAlternatives } from '../../../mock-data/mock-data';

@Component({
  selector: 'app-analytics-view',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl:'./analytics-view.component.html'
})
export class AnalyticsViewComponent {
  totalStudents = mockStudentAssessments.length;
  totalCriteria = defaultCriteria.length;
  totalAlternatives = defaultAlternatives.length;

  readonly Users = Users;
  readonly BarChart3 = BarChart3;
  readonly ClipboardList = ClipboardList;
  readonly TrendingUp = TrendingUp;

  get criterionAverages() {
    return defaultCriteria.map(criterion => {
      const total = mockStudentAssessments.reduce((sum, student) => {
        return sum + (student.values[criterion.code] || 0);
      }, 0);
      return {
        code: criterion.code,
        name: criterion.name,
        average: total / this.totalStudents
      };
    });
  }

  get overallAverage() {
    const averages = this.criterionAverages;
    const sum = averages.reduce((sum, c) => sum + c.average, 0);
    return (sum / averages.length).toFixed(1);
  }
}