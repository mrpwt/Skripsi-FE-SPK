export interface TestQuestion {
  id: string;
  question: string;
  options: TestOption[];
  correctAnswer: string;
  alternativeId: string; // Bidang yang terkait
  points: number;
}

export interface TestOption {
  id: string;
  text: string;
}

export interface TestResult {
  alternativeId: string;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface UserTestAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}
