import { describe, expect, it } from 'vitest';
import { rankRecommendations } from '../engine/rankRecommendations';
import type { Activity, CategorySummary, Profile } from '../types';

const summaries: CategorySummary[] = [
  { category: 'transport', kgCo2e: 10, share: 70 },
  { category: 'food', kgCo2e: 3, share: 20 },
  { category: 'energy', kgCo2e: 1.5, share: 10 }
];

const baseProfile: Profile = {
  housing: 'rented', householdSize: 3, diet: 'vegetarian', budget: 'low', goal: 'reduce'
};

const activities: Activity[] = [
  { id: 'trip', date: '2026-06-08', category: 'transport', mode: 'car', distanceKm: 40, passengers: 1 },
  { id: 'meal', date: '2026-06-08', category: 'food', foodType: 'vegetarian', meals: 2 },
  { id: 'power', date: '2026-06-08', category: 'energy', kwh: 10, sharedHousehold: true }
];

describe('recommendation ranking', () => {
  it('does not recommend red-meat reduction to a vegetarian', () => {
    const items = rankRecommendations(baseProfile, activities, summaries);
    expect(items.some((item) => item.id === 'swap-red-meat')).toBe(false);
    expect(items.some((item) => item.id === 'prevent-food-waste')).toBe(true);
  });

  it('does not lead renters with owned-home appliance advice', () => {
    const items = rankRecommendations(baseProfile, activities, summaries);
    expect(items.some((item) => item.id === 'energy-audit')).toBe(false);
  });

  it('adds a red-meat substitution only when logged by a mixed-diet user', () => {
    const mixedProfile: Profile = { ...baseProfile, diet: 'mixed' };
    const mixedActivities: Activity[] = [
      ...activities,
      { id: 'red', date: '2026-06-08', category: 'food', foodType: 'red-meat', meals: 1 }
    ];
    const items = rankRecommendations(mixedProfile, mixedActivities, summaries);
    expect(items.some((item) => item.id === 'swap-red-meat')).toBe(true);
  });


  it('uses only the latest seven-day window for weekly savings', () => {
    const datedActivities: Activity[] = [
      { id: 'old-trip', date: '2026-05-01', category: 'transport', mode: 'car', distanceKm: 1000, passengers: 1 },
      { id: 'recent-trip', date: '2026-06-08', category: 'transport', mode: 'car', distanceKm: 10, passengers: 1 }
    ];
    const items = rankRecommendations(baseProfile, datedActivities, summaries);
    const replacement = items.find((item) => item.id === 'replace-car-metro');
    expect(replacement?.estimatedWeeklySavingKg).toBe(0.7);
  });

  it('ranks recommendations from highest to lowest priority', () => {
    const items = rankRecommendations(baseProfile, activities, summaries);
    const priorities = items.map((item) => item.priority);
    expect(priorities).toEqual([...priorities].sort((a, b) => b - a));
  });
});
