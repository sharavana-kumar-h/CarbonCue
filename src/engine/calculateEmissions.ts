import { ELECTRICITY_FACTOR, FOOD_FACTORS, TRANSPORT_FACTORS } from '../data/emissionFactors';
import type { Activity, Category, CategorySummary, Confidence, EmissionResult, Profile } from '../types';

const round = (value: number, precision = 2): number => {
  const power = 10 ** precision;
  return Math.round(value * power) / power;
};

export function calculateActivityEmission(activity: Activity, profile: Profile | null): EmissionResult {
  if (activity.category === 'transport') {
    const record = TRANSPORT_FACTORS[activity.mode];
    const occupancyDivisor = ['car', 'motorbike'].includes(activity.mode)
      ? Math.max(1, activity.passengers)
      : 1;
    const kgCo2e = activity.distanceKm * record.factor / occupancyDivisor;
    const confidence: Confidence = ['walk', 'bicycle'].includes(activity.mode) ? 'high' : 'medium';

    return {
      activityId: activity.id,
      category: 'transport',
      kgCo2e: round(kgCo2e),
      confidence,
      explanation: `${activity.distanceKm} km × ${record.factor} ${record.unit}${occupancyDivisor > 1 ? ` ÷ ${occupancyDivisor} passengers` : ''}.`
    };
  }

  if (activity.category === 'food') {
    const record = FOOD_FACTORS[activity.foodType];
    const confidence: Confidence = activity.foodType === 'packaged' ? 'low' : 'medium';
    return {
      activityId: activity.id,
      category: 'food',
      kgCo2e: round(activity.meals * record.factor),
      confidence,
      explanation: `${activity.meals} meal${activity.meals === 1 ? '' : 's'} × ${record.factor} ${record.unit}.`
    };
  }

  const divisor = activity.sharedHousehold && profile ? Math.max(1, profile.householdSize) : 1;
  return {
    activityId: activity.id,
    category: 'energy',
    kgCo2e: round(activity.kwh * ELECTRICITY_FACTOR.factor / divisor),
    confidence: 'high',
    explanation: `${activity.kwh} kWh × ${ELECTRICITY_FACTOR.factor} ${ELECTRICITY_FACTOR.unit}${divisor > 1 ? ` ÷ ${divisor} household members` : ''}.`
  };
}

export function calculateAllEmissions(activities: Activity[], profile: Profile | null): EmissionResult[] {
  return activities.map((activity) => calculateActivityEmission(activity, profile));
}

export function summarizeByCategory(results: EmissionResult[]): CategorySummary[] {
  const categories: Category[] = ['transport', 'food', 'energy'];
  const total = results.reduce((sum, result) => sum + result.kgCo2e, 0);

  return categories.map((category) => {
    const kgCo2e = results
      .filter((result) => result.category === category)
      .reduce((sum, result) => sum + result.kgCo2e, 0);
    return {
      category,
      kgCo2e: round(kgCo2e),
      share: total > 0 ? round((kgCo2e / total) * 100, 1) : 0
    };
  });
}

export function calculateTotal(results: EmissionResult[]): number {
  return round(results.reduce((sum, result) => sum + result.kgCo2e, 0));
}

export function averageConfidence(results: EmissionResult[]): Confidence {
  if (!results.length) return 'low';
  const score: Record<Confidence, number> = { low: 1, medium: 2, high: 3 };
  const average = results.reduce((sum, result) => sum + score[result.confidence], 0) / results.length;
  if (average >= 2.5) return 'high';
  if (average >= 1.5) return 'medium';
  return 'low';
}
