import { Criterion, Alternative, StudentAssessment } from '../models/saw';

export const defaultCriteria: Criterion[] = [
  {
    code: 'C1',
    name: 'Nilai Mata Kuliah Terkait',
    weight: 0.25,
    type: 'benefit'
  },
  {
    code: 'C2',
    name: 'Minat Mahasiswa',
    weight: 0.20,
    type: 'benefit'
  },
  {
    code: 'C3',
    name: 'Bakat / Tes Kemampuan',
    weight: 0.20,
    type: 'benefit'
  },
  {
    code: 'C4',
    name: 'Pengalaman Proyek',
    weight: 0.15,
    type: 'benefit'
  },
  {
    code: 'C5',
    name: 'Rencana Karier',
    weight: 0.10,
    type: 'benefit'
  },
  {
    code: 'C6',
    name: 'Ketersediaan Dosen Pembimbing',
    weight: 0.10,
    type: 'benefit'
  }
];

export const defaultAlternatives: Alternative[] = [
  {
    id: 'alt1',
    code: 'RPL',
    name: 'Rekayasa Perangkat Lunak',
    description: 'Fokus pada pengembangan software, aplikasi mobile dan web'
  },
  {
    id: 'alt2',
    code: 'AI',
    name: 'Artificial Intelligence',
    description: 'Fokus pada machine learning, data science, dan AI'
  },
  {
    id: 'alt3',
    code: 'CYBER',
    name: 'Cyber Security',
    description: 'Fokus pada keamanan sistem, jaringan, dan data'
  }
];

export const mockStudentAssessments: StudentAssessment[] = [
  {
    id: 'assess1',
    studentId: 'user1',
    studentName: 'Ahmad Fauzi',
    nim: '1234567890',
    values: {
      C1: 85,
      C2: 90,
      C3: 80,
      C4: 75,
      C5: 85,
      C6: 70
    },
    createdAt: new Date('2024-01-15')
  },
  {
    id: 'assess2',
    studentId: 'user2',
    studentName: 'Siti Nurhaliza',
    nim: '1234567891',
    values: {
      C1: 90,
      C2: 85,
      C3: 88,
      C4: 80,
      C5: 90,
      C6: 85
    },
    createdAt: new Date('2024-01-16')
  },
  {
    id: 'assess3',
    studentId: 'user3',
    studentName: 'Budi Santoso',
    nim: '1234567892',
    values: {
      C1: 75,
      C2: 80,
      C3: 70,
      C4: 85,
      C5: 75,
      C6: 80
    },
    createdAt: new Date('2024-01-17')
  }
];