import { beforeEach, describe, expect, it } from 'vitest';
import { loadState } from '../storage/localStorageRepository';

const key = 'carboncue:v1';

beforeEach(() => {
  window.localStorage.clear();
});

describe('persisted-state validation', () => {
  it('falls back safely when JSON is corrupted', () => {
    window.localStorage.setItem(key, '{not-json');
    expect(loadState()).toEqual({ profile: null, activities: [] });
  });

  it('rejects a malformed profile instead of trusting browser storage', () => {
    window.localStorage.setItem(key, JSON.stringify({
      profile: {
        housing: 'spaceship',
        householdSize: 999,
        diet: 'vegetarian',
        budget: 'low',
        goal: 'reduce'
      },
      activities: []
    }));

    expect(loadState()).toEqual({ profile: null, activities: [] });
  });


  it('preserves the demo marker only when the stored value is valid', () => {
    window.localStorage.setItem(key, JSON.stringify({
      mode: 'demo',
      profile: {
        housing: 'rented',
        householdSize: 3,
        diet: 'vegetarian',
        budget: 'low',
        goal: 'reduce'
      },
      activities: []
    }));

    expect(loadState().mode).toBe('demo');
  });

  it('keeps valid activities and removes malformed entries', () => {
    window.localStorage.setItem(key, JSON.stringify({
      profile: {
        housing: 'rented',
        householdSize: 3,
        diet: 'vegetarian',
        budget: 'low',
        goal: 'track'
      },
      activities: [
        {
          id: 'valid-trip',
          date: '2026-06-08',
          category: 'transport',
          mode: 'metro',
          distanceKm: 12,
          passengers: 1
        },
        {
          id: 'invalid-trip',
          date: 'not-a-date',
          category: 'transport',
          mode: 'car',
          distanceKm: -5,
          passengers: 0
        }
      ]
    }));

    const state = loadState();
    expect(state.profile?.goal).toBe('track');
    expect(state.activities).toHaveLength(1);
    expect(state.activities[0].id).toBe('valid-trip');
  });
});

  it('keeps a valid weekly action and drops malformed action data', () => {
    window.localStorage.setItem(key, JSON.stringify({
      profile: {
        housing: 'rented',
        householdSize: 3,
        diet: 'vegetarian',
        budget: 'low',
        goal: 'reduce'
      },
      activities: [],
      weeklyAction: {
        id: 'action-1',
        recommendationId: 'carpool',
        title: 'Share the highest-distance ride',
        category: 'transport',
        weeklySavingKg: 2.4,
        startedOn: '2026-06-08',
        status: 'active'
      }
    }));

    expect(loadState().weeklyAction?.recommendationId).toBe('carpool');

    window.localStorage.setItem(key, JSON.stringify({
      profile: {
        housing: 'rented',
        householdSize: 3,
        diet: 'vegetarian',
        budget: 'low',
        goal: 'reduce'
      },
      activities: [],
      weeklyAction: {
        id: 'action-2',
        recommendationId: 'carpool',
        title: 'x'.repeat(180),
        category: 'invalid-category',
        weeklySavingKg: -9,
        startedOn: 'bad-date',
        status: 'unknown'
      }
    }));

    expect(loadState().weeklyAction).toBeNull();
  });
