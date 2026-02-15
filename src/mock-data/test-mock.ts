import { TestQuestion } from '../models/test';

export const defaultTestQuestions: TestQuestion[] = [
  // RPL Questions
  {
    id: 'q1',
    question: 'Apa yang dimaksud dengan Design Pattern dalam software engineering?',
    options: [
      { id: 'a', text: 'Template untuk membuat desain UI yang menarik' },
      { id: 'b', text: 'Solusi umum yang dapat digunakan kembali untuk masalah yang sering terjadi dalam desain software' },
      { id: 'c', text: 'Algoritma untuk optimasi database' },
      { id: 'd', text: 'Framework untuk membuat aplikasi web' }
    ],
    correctAnswer: 'b',
    alternativeId: 'alt1',
    points: 10
  },
  {
    id: 'q2',
    question: 'Manakah yang BUKAN merupakan prinsip SOLID dalam OOP?',
    options: [
      { id: 'a', text: 'Single Responsibility Principle' },
      { id: 'b', text: 'Open/Closed Principle' },
      { id: 'c', text: 'Database First Principle' },
      { id: 'd', text: 'Dependency Inversion Principle' }
    ],
    correctAnswer: 'c',
    alternativeId: 'alt1',
    points: 10
  },
  {
    id: 'q3',
    question: 'Dalam metodologi Agile, apa yang dimaksud dengan Sprint?',
    options: [
      { id: 'a', text: 'Periode waktu tertentu untuk menyelesaikan sejumlah pekerjaan' },
      { id: 'b', text: 'Nama tim developer' },
      { id: 'c', text: 'Testing terakhir sebelum deployment' },
      { id: 'd', text: 'Dokumentasi proyek' }
    ],
    correctAnswer: 'a',
    alternativeId: 'alt1',
    points: 10
  },
  
  // AI Questions
  {
    id: 'q4',
    question: 'Apa perbedaan utama antara Supervised dan Unsupervised Learning?',
    options: [
      { id: 'a', text: 'Supervised learning menggunakan GPU, unsupervised tidak' },
      { id: 'b', text: 'Supervised learning menggunakan data berlabel, unsupervised tidak' },
      { id: 'c', text: 'Supervised learning lebih cepat dari unsupervised' },
      { id: 'd', text: 'Tidak ada perbedaan signifikan' }
    ],
    correctAnswer: 'b',
    alternativeId: 'alt2',
    points: 10
  },
  {
    id: 'q5',
    question: 'Algoritma manakah yang termasuk dalam Neural Network?',
    options: [
      { id: 'a', text: 'Binary Search' },
      { id: 'b', text: 'Quick Sort' },
      { id: 'c', text: 'Backpropagation' },
      { id: 'd', text: 'Dijkstra' }
    ],
    correctAnswer: 'c',
    alternativeId: 'alt2',
    points: 10
  },
  {
    id: 'q6',
    question: 'Apa fungsi utama dari activation function dalam neural network?',
    options: [
      { id: 'a', text: 'Menyimpan data training' },
      { id: 'b', text: 'Menambahkan non-linearitas ke model' },
      { id: 'c', text: 'Mengompress gambar' },
      { id: 'd', text: 'Menghapus noise dari data' }
    ],
    correctAnswer: 'b',
    alternativeId: 'alt2',
    points: 10
  },

  // Cyber Security Questions
  {
    id: 'q7',
    question: 'Apa yang dimaksud dengan SQL Injection?',
    options: [
      { id: 'a', text: 'Teknik untuk mempercepat query database' },
      { id: 'b', text: 'Serangan dengan menyisipkan kode SQL berbahaya melalui input' },
      { id: 'c', text: 'Metode backup database' },
      { id: 'd', text: 'Cara mengenkripsi database' }
    ],
    correctAnswer: 'b',
    alternativeId: 'alt3',
    points: 10
  },
  {
    id: 'q8',
    question: 'Manakah yang merupakan symmetric encryption algorithm?',
    options: [
      { id: 'a', text: 'RSA' },
      { id: 'b', text: 'AES' },
      { id: 'c', text: 'ECC' },
      { id: 'd', text: 'Diffie-Hellman' }
    ],
    correctAnswer: 'b',
    alternativeId: 'alt3',
    points: 10
  },
  {
    id: 'q9',
    question: 'Apa tujuan utama dari firewall?',
    options: [
      { id: 'a', text: 'Meningkatkan kecepatan internet' },
      { id: 'b', text: 'Menyimpan data backup' },
      { id: 'c', text: 'Memfilter dan mengontrol traffic jaringan berdasarkan aturan keamanan' },
      { id: 'd', text: 'Mengkompress data yang dikirim' }
    ],
    correctAnswer: 'c',
    alternativeId: 'alt3',
    points: 10
  }
];
