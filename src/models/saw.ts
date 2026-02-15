export interface Criterion {
  code: string;
  name: string;
  weight: number;
  type: 'benefit' | 'cost';
}

export interface Alternative {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface StudentAssessment {
  id: string;
  studentId: string;
  studentName: string;
  nim: string;
  values: {
    [criterionCode: string]: number;
  };
  createdAt: Date;
}

export interface SAWResult {
  alternativeId: string;
  alternativeName: string;
  score: number;
  normalizedValues: {
    [criterionCode: string]: number;
  };
}
