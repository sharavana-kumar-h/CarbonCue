import { describe, expect, it } from 'vitest';
import { calculateAllEmissions } from '../engine/calculateEmissions';
import { buildTrendSummary, currentLocalIsoDate, shiftIsoDate } from '../engine/trends';
import type { Activity, Profile } from '../types';

const profile: Profile = {
  housing: 'rented',
  householdSize: 2,
  diet: 'vegetarian',
  budget: 'low',
  goal: 'reduce'
};

describe('time-based progress', () => {
  it('creates a seven-day window ending on the supplied date', () => {
    const activities: Activity[] = [
      { id: 'today', date: '2026-06-08', category: 'food', foodType: 'vegetarian', meals: 2 },
      { id: 'past', date: '2026-06-02', category: 'energy', kwh: 4, sharedHousehold: true }
    ];
    const results = calculateAllEmissions(activities, profile);
    const trend = buildTrendSummary(activities, results, '2026-06-08');

    expect(trend.days).toHaveLength(7);
    expect(trend.days[0].date).toBe('2026-06-02');
    expect(trend.days[6].date).toBe('2026-06-08');
    expect(trend.activeDays).toBe(2);
  });

  it('compares the current seven days against the previous seven days', () => {
    const activities: Activity[] = [
      { id: 'current', date: '2026-06-08', category: 'food', foodType: 'vegetarian', meals: 2 },
      { id: 'previous', date: '2026-06-01', category: 'food', foodType: 'vegetarian', meals: 4 }
    ];
    const results = calculateAllEmissions(activities, profile);
    const trend = buildTrendSummary(activities, results, '2026-06-08');

    expect(trend.currentTotalKg).toBe(2.4);
    expect(trend.previousTotalKg).toBe(4.8);
    expect(trend.changePercent).toBe(-50);
  });

  it('does not claim a percentage change without previous-week data', () => {
    const activities: Activity[] = [
      { id: 'only', date: '2026-06-08', category: 'transport', mode: 'metro', distanceKm: 10, passengers: 1 }
    ];
    const results = calculateAllEmissions(activities, profile);
    const trend = buildTrendSummary(activities, results, '2026-06-08');

    expect(trend.changePercent).toBeNull();
  });


  it('formats the browser-local calendar date instead of a raw UTC date', () => {
    const localMidnight = new Date(2026, 5, 8, 0, 30, 0);
    expect(currentLocalIsoDate(localMidnight)).toBe('2026-06-08');
  });

  it('shifts ISO dates safely across month boundaries', () => {
    expect(shiftIsoDate('2026-06-01', -1)).toBe('2026-05-31');
    expect(shiftIsoDate('2026-12-31', 1)).toBe('2027-01-01');
  });
});
