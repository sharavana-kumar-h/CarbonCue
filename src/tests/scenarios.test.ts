import { describe, expect, it } from 'vitest';
import { buildScenarios } from '../engine/scenarios';
import type { Activity, Profile } from '../types';

const vegetarianProfile: Profile = {
  housing: 'rented',
  householdSize: 4,
  diet: 'vegetarian',
  budget: 'low',
  goal: 'reduce'
};

const baseActivities: Activity[] = [
  { id: 'car', date: '2026-06-08', category: 'transport', mode: 'car', distanceKm: 30, passengers: 1 },
  { id: 'energy', date: '2026-06-08', category: 'energy', kwh: 20, sharedHousehold: true }
];

describe('personalized scenarios', () => {
  it('offers travel scenarios only when relevant travel is recorded', () => {
    const scenarios = buildScenarios(vegetarianProfile, baseActivities);
    expect(scenarios.some((item) => item.id === 'road-to-metro')).toBe(true);
    expect(scenarios.some((item) => item.id === 'carpool')).toBe(true);
  });

  it('excludes red-meat substitution for a vegetarian profile', () => {
    const scenarios = buildScenarios(vegetarianProfile, [
      ...baseActivities,
      { id: 'tampered', date: '2026-06-08', category: 'food', foodType: 'red-meat', meals: 1 }
    ]);
    expect(scenarios.some((item) => item.id === 'red-meat-swap')).toBe(false);
  });

  it('adds red-meat substitution for a mixed-diet user who logged it', () => {
    const mixedProfile: Profile = { ...vegetarianProfile, diet: 'mixed' };
    const scenarios = buildScenarios(mixedProfile, [
      ...baseActivities,
      { id: 'red', date: '2026-06-08', category: 'food', foodType: 'red-meat', meals: 1 }
    ]);
    expect(scenarios.some((item) => item.id === 'red-meat-swap')).toBe(true);
  });


  it('does not inflate weekly scenarios with older history', () => {
    const scenarios = buildScenarios(vegetarianProfile, [
      { id: 'old-car', date: '2026-05-01', category: 'transport', mode: 'car', distanceKm: 1000, passengers: 1 },
      { id: 'recent-car', date: '2026-06-08', category: 'transport', mode: 'car', distanceKm: 10, passengers: 1 }
    ]);
    const substitution = scenarios.find((item) => item.id === 'road-to-metro');
    expect(substitution?.weeklySavingKg).toBe(1.4);
  });

  it('allocates shared electricity savings across the household', () => {
    const scenarios = buildScenarios(vegetarianProfile, baseActivities);
    const energy = scenarios.find((item) => item.id === 'energy-reduction');
    expect(energy?.weeklySavingKg).toBe(0.7);
  });
});
