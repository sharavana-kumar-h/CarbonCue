import type {
  Activity,
  AppState,
  Budget,
  Diet,
  FoodType,
  Housing,
  Profile,
  TransportMode
} from '../types';

const STORAGE_KEY = 'carboncue:v1';
const EMPTY_STATE: AppState = { profile: null, activities: [] };

const housings: Housing[] = ['hostel', 'rented', 'owned'];
const diets: Diet[] = ['plant-based', 'vegetarian', 'mixed'];
const budgets: Budget[] = ['free-only', 'low', 'flexible'];
const goals: Profile['goal'][] = ['learn', 'reduce', 'track'];
const transportModes: TransportMode[] = ['walk', 'bicycle', 'bus', 'metro', 'motorbike', 'car', 'taxi'];
const foodTypes: FoodType[] = ['plant-based', 'vegetarian', 'chicken', 'red-meat', 'packaged'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFiniteNumber(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

function isStringIn<T extends string>(value: unknown, allowed: readonly T[]): value is T {
  return typeof value === 'string' && allowed.includes(value as T);
}

function isProfile(value: unknown): value is Profile {
  if (!isRecord(value)) return false;
  return isStringIn(value.housing, housings)
    && isFiniteNumber(value.householdSize, 1, 20)
    && Number.isInteger(value.householdSize)
    && isStringIn(value.diet, diets)
    && isStringIn(value.budget, budgets)
    && isStringIn(value.goal, goals);
}

function hasValidBaseActivity(value: Record<string, unknown>): boolean {
  return typeof value.id === 'string'
    && value.id.length > 0
    && value.id.length <= 100
    && typeof value.date === 'string'
    && /^\d{4}-\d{2}-\d{2}$/.test(value.date);
}

function isActivity(value: unknown): value is Activity {
  if (!isRecord(value) || !hasValidBaseActivity(value)) return false;

  if (value.category === 'transport') {
    return isStringIn(value.mode, transportModes)
      && isFiniteNumber(value.distanceKm, 0.1, 2000)
      && isFiniteNumber(value.passengers, 1, 8)
      && Number.isInteger(value.passengers);
  }

  if (value.category === 'food') {
    return isStringIn(value.foodType, foodTypes)
      && isFiniteNumber(value.meals, 1, 30)
      && Number.isInteger(value.meals);
  }

  if (value.category === 'energy') {
    return isFiniteNumber(value.kwh, 0.1, 5000)
      && typeof value.sharedHousehold === 'boolean';
  }

  return false;
}

export function loadState(): AppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE;

    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return EMPTY_STATE;

    const profile = parsed.profile === null ? null : isProfile(parsed.profile) ? parsed.profile : null;
    const activities = Array.isArray(parsed.activities)
      ? parsed.activities.filter(isActivity).slice(0, 250)
      : [];

    if (parsed.profile !== null && !profile) return EMPTY_STATE;
    const mode = parsed.mode === 'demo' ? 'demo' : undefined;
    return mode ? { profile, activities, mode } : { profile, activities };
  } catch {
    return EMPTY_STATE;
  }
}

export function saveState(state: AppState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The app remains usable in memory when storage is blocked or full.
  }
}

export function clearState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // No-op when storage is unavailable.
  }
}
