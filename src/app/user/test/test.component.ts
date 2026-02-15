import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoalTestService } from '../../../services/soal-test.service';
import { BidangService } from '../../../services/bidang.service';
import { SoalTestDto, BidangDto } from '../../../model';
import { ChangeDetectorRef } from '@angular/core'

// Interface lokal untuk menampung jawaban user
interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
  isCorrect: boolean;
  bidangId: number;
}

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test.component.html'
})
export class TestComponent implements OnInit {
  @Output() complete = new EventEmitter<any>();

  questions: SoalTestDto[] = [];
  alternatives: BidangDto[] = [];
  currentQuestionIndex = 0;
  answers: UserAnswer[] = [];
  selectedAnswer = '';
  isLoading = true;

  constructor(
    private soalService: SoalTestService,
    private bidangService: BidangService,
    private cdr: ChangeDetectorRef
  ) { }

  async ngOnInit() {
    try {
      const [soalRes, bidangRes] = await Promise.all([
        this.soalService.getAll(),
        this.bidangService.getAll()
      ]);

      this.alternatives = bidangRes;

      // 🔹 1. Kelompokkan soal per bidang
      const grouped: { [key: number]: SoalTestDto[] } = {};

      soalRes.forEach(q => {
        const bidangId = (q as any).bidang_id || q.bidangId;
        if (!grouped[bidangId]) {
          grouped[bidangId] = [];
        }
        grouped[bidangId].push(q);
      });

      // 🔹 2. Ambil max 5 soal random per bidang
      let finalQuestions: SoalTestDto[] = [];

      Object.keys(grouped).forEach(key => {
        const bidangQuestions = grouped[Number(key)];
        const shuffled = this.shuffleArray(bidangQuestions);
        const limited = shuffled.slice(0, 5); // max 5
        finalQuestions = [...finalQuestions, ...limited];
      });

      // 🔹 3. Optional: random lagi biar tidak urut per bidang
      this.questions = this.shuffleArray(finalQuestions);

      this.isLoading = false;
      this.cdr.detectChanges();

    } catch (error) {
      console.error('Gagal memuat tes:', error);
      this.isLoading = false;
    }
  }


  get currentQuestion(): SoalTestDto {
    return this.questions[this.currentQuestionIndex];
  }

  get progress(): number {
    if (this.questions.length === 0) return 0;
    return Math.round(((this.currentQuestionIndex + 1) / this.questions.length) * 100);
  }

  handleNext() {
    // Gunakan 'jawaban_benar' jika 'jawabanBenar' undefined
    const correctAttr = (this.currentQuestion as any).jawaban_benar || this.currentQuestion.jawabanBenar;
    const isCorrect = this.selectedAnswer === correctAttr;

    this.answers.push({
      questionId: this.currentQuestion.id!,
      selectedAnswer: this.selectedAnswer,
      isCorrect: isCorrect,
      // Gunakan 'bidang_id' jika 'bidangId' undefined
      bidangId: (this.currentQuestion as any).bidang_id || this.currentQuestion.bidangId
    });

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedAnswer = '';
    } else {
      this.finishTest();
    }
  }

  getBidangName(id: number): string {
    return this.alternatives.find(a => a.id === id)?.namaBidang || 'Umum';
  }

  // Di dalam test.component.ts

  getPointFromStorage(bidangId: number): number {
    const savedPoints = localStorage.getItem('bidang_points');
    if (savedPoints) {
      const pointsMap = JSON.parse(savedPoints);
      return pointsMap[bidangId] || 10; // Default 10 jika bidang spesifik tidak ada
    }
    return 10; // Default 10 jika localStorage kosong
  }

  finishTest() {
    const results = this.alternatives.map(alt => {
      // 1. Ambil semua soal untuk bidang ini
      const questionsInAlt = this.questions.filter(q => {
        const bId = (q as any).bidang_id || q.bidangId;
        return Number(bId) === Number(alt.id);
      });

      // 2. Hitung jawaban yang benar
      const correctAnswers = this.answers.filter(a =>
        Number(a.bidangId) === Number(alt.id) && a.isCorrect
      ).length;

      // 3. Rumus: (Benar / Total Soal) * 100
      const totalSoal = questionsInAlt.length;
      const score = totalSoal > 0 ? Math.round((correctAnswers / totalSoal) * 100) : 0;

      return {
        bidangId: alt.id,
        percentage: score
      };
    });

    this.complete.emit(results);
  }

  private shuffleArray<T>(array: T[]): T[] {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

}