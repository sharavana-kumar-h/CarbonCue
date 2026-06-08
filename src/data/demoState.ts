import type { AppState } from '../types';
import { currentLocalIsoDate, shiftIsoDate } from '../engine/trends';

export function createDemoState(referenceDate = currentLocalIsoDate()): AppState {
  const today = referenceDate;
  const id = () => crypto.randomUUID();
  const date = (daysAgo: number) => shiftIsoDate(today, -daysAgo);
  const demo: AppState = {
    mode: 'demo',
    profile: {
      housing: 'rented',
      householdSize: 3,
      diet: 'vegetarian',
      budget: 'low',
      goal: 'reduce'
    },
    activities: [
      { id: id(), date: date(0), category: 'transport', mode: 'car', distanceKm: 32, passengers: 1 },
      { id: id(), date: date(0), category: 'transport', mode: 'metro', distanceKm: 18, passengers: 1 },
      { id: id(), date: date(0), category: 'food', foodType: 'vegetarian', meals: 4 },
      { id: id(), date: date(0), category: 'food', foodType: 'packaged', meals: 1 },
      { id: id(), date: date(0), category: 'energy', kwh: 18, sharedHousehold: true },
      { id: id(), date: date(1), category: 'transport', mode: 'car', distanceKm: 20, passengers: 1 },
      { id: id(), date: date(1), category: 'food', foodType: 'vegetarian', meals: 3 },
      { id: id(), date: date(2), category: 'transport', mode: 'bus', distanceKm: 24, passengers: 1 },
      { id: id(), date: date(2), category: 'food', foodType: 'vegetarian', meals: 3 },
      { id: id(), date: date(2), category: 'energy', kwh: 9, sharedHousehold: true },
      { id: id(), date: date(3), category: 'transport', mode: 'metro', distanceKm: 18, passengers: 1 },
      { id: id(), date: date(3), category: 'food', foodType: 'vegetarian', meals: 3 },
      { id: id(), date: date(4), category: 'transport', mode: 'car', distanceKm: 28, passengers: 1 },
      { id: id(), date: date(4), category: 'food', foodType: 'vegetarian', meals: 3 },
      { id: id(), date: date(4), category: 'food', foodType: 'packaged', meals: 1 },
      { id: id(), date: date(5), category: 'transport', mode: 'bus', distanceKm: 20, passengers: 1 },
      { id: id(), date: date(5), category: 'food', foodType: 'vegetarian', meals: 3 },
      { id: id(), date: date(6), category: 'transport', mode: 'metro', distanceKm: 18, passengers: 1 },
      { id: id(), date: date(6), category: 'food', foodType: 'vegetarian', meals: 3 },
      { id: id(), date: date(6), category: 'energy', kwh: 15, sharedHousehold: true },
      { id: id(), date: date(7), category: 'transport', mode: 'car', distanceKm: 50, passengers: 1 },
      { id: id(), date: date(7), category: 'food', foodType: 'vegetarian', meals: 3 },
      { id: id(), date: date(7), category: 'food', foodType: 'packaged', meals: 1 },
      { id: id(), date: date(7), category: 'energy', kwh: 18, sharedHousehold: true },
      { id: id(), date: date(8), category: 'transport', mode: 'taxi', distanceKm: 30, passengers: 1 },
      { id: id(), date: date(8), category: 'food', foodType: 'vegetarian', meals: 3 },
      { id: id(), date: date(9), category: 'transport', mode: 'car', distanceKm: 45, passengers: 1 },
      { id: id(), date: date(9), category: 'food', foodType: 'vegetarian', meals: 3 },
      { id: id(), date: date(9), category: 'food', foodType: 'packaged', meals: 1 },
      { id: id(), date: date(10), category: 'transport', mode: 'bus', distanceKm: 35, passengers: 1 },
      { id: id(), date: date(10), category: 'food', foodType: 'vegetarian', meals: 3 },
      { id: id(), date: date(10), category: 'energy', kwh: 18, sharedHousehold: true },
      { id: id(), date: date(11), category: 'transport', mode: 'car', distanceKm: 40, passengers: 1 },
      { id: id(), date: date(11), category: 'food', foodType: 'vegetarian', meals: 4 },
      { id: id(), date: date(12), category: 'transport', mode: 'taxi', distanceKm: 25, passengers: 1 },
      { id: id(), date: date(12), category: 'food', foodType: 'vegetarian', meals: 3 },
      { id: id(), date: date(12), category: 'food', foodType: 'packaged', meals: 1 },
      { id: id(), date: date(13), category: 'transport', mode: 'car', distanceKm: 42, passengers: 1 },
      { id: id(), date: date(13), category: 'food', foodType: 'vegetarian', meals: 3 },
      { id: id(), date: date(13), category: 'energy', kwh: 15, sharedHousehold: true }
    ]
  };
  return demo;
}
