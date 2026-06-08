import { describe, expect, it } from 'vitest';
import { calculateActivityEmission, calculateAllEmissions, calculateTotal, summarizeByCategory } from '../engine/calculateEmissions';
import type { Activity, Profile } from '../types';

const profile: Profile = {
  housing: 'rented',
  householdSize: 4,
  diet: 'vegetarian',
  budget: 'low',
  goal: 'reduce'
};

describe('carbon calculations', () => {
  it('allocates average car emissions across occupants', () => {
    const result = calculateActivityEmission({
      id: 'trip', date: '2026-06-08', category: 'transport', mode: 'car', distanceKm: 100, passengers: 2
    }, profile);
    expect(result.kgCo2e).toBe(8.65);
  });

  it('allocates shared electricity across household members', () => {
    const result = calculateActivityEmission({
      id: 'energy', date: '2026-06-08', category: 'energy', kwh: 20, sharedHousehold: true
    }, profile);
    expect(result.kgCo2e).toBe(3.55);
    expect(result.confidence).toBe('high');
  });

  it('calculates broad meal estimates', () => {
    const result = calculateActivityEmission({
      id: 'meal', date: '2026-06-08', category: 'food', foodType: 'vegetarian', meals: 2
    }, profile);
    expect(result.kgCo2e).toBe(2.4);
    expect(result.confidence).toBe('medium');
  });

  it('summarizes categories and shares', () => {
    const activities: Activity[] = [
      { id: 'a', date: '2026-06-08', category: 'transport', mode: 'car', distanceKm: 10, passengers: 1 },
      { id: 'b', date: '2026-06-08', category: 'food', foodType: 'vegetarian', meals: 1 }
    ];
    const results = calculateAllEmissions(activities, profile);
    const summaries = summarizeByCategory(results);
    expect(calculateTotal(results)).toBe(2.93);
    expect(summaries.reduce((sum, item) => sum + item.share, 0)).toBeCloseTo(100, 0);
  });
});
