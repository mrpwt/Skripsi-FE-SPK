import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Eye, X } from 'lucide-angular';
import { mockStudentAssessments } from '../../../mock-data/mock-data';
import { StudentAssessment } from '../../../models/saw';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './students.component.html'
})
export class StudentsComponent {
  students: StudentAssessment[] = mockStudentAssessments;
  searchTerm = '';
  selectedStudent: StudentAssessment | null = null;

  readonly Search = Search;
  readonly Eye = Eye;
  readonly X = X;

  get filteredStudents() {
    return this.students.filter(student => 
      student.studentName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      student.nim.includes(this.searchTerm)
    );
  }

  // Helper untuk mendapatkan keys dari object values di template
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}