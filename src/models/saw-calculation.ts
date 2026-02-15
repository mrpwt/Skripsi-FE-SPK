import { Injectable } from '@angular/core';
import { Criterion, Alternative, SAWResult } from '../models/saw';

@Injectable({
  providedIn: 'root'
})
export class SawService {

  calculateSAW(
    criteria: Criterion[],
    alternatives: Alternative[],
    assessmentValues: { [alternativeId: string]: { [criterionCode: string]: number } }
  ): SAWResult[] {
    const normalizedMatrix: { [alternativeId: string]: { [criterionCode: string]: number } } = {};

    // Step 1: Normalisasi matriks
    criteria.forEach((criterion) => {
      const values = alternatives.map(alt => assessmentValues[alt.id]?.[criterion.code] || 0);
      const maxValue = Math.max(...values);
      const minValue = Math.min(...values);

      alternatives.forEach((alternative) => {
        if (!normalizedMatrix[alternative.id]) {
          normalizedMatrix[alternative.id] = {};
        }

        const value = assessmentValues[alternative.id]?.[criterion.code] || 0;

        if (criterion.type === 'benefit') {
          normalizedMatrix[alternative.id][criterion.code] = maxValue > 0 ? value / maxValue : 0;
        } else {
          normalizedMatrix[alternative.id][criterion.code] = value > 0 ? minValue / value : 0;
        }
      });
    });

    // Step 2 & 3: Perankingan
    return alternatives.map((alternative) => {
      let score = 0;
      criteria.forEach((criterion) => {
        const normalizedValue = normalizedMatrix[alternative.id][criterion.code];
        score += normalizedValue * criterion.weight;
      });

      return {
        alternativeId: alternative.id,
        alternativeName: alternative.name,
        score: score,
        normalizedValues: normalizedMatrix[alternative.id]
      };
    }).sort((a, b) => b.score - a.score);
  }
}