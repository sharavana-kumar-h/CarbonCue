export type Housing = 'hostel' | 'rented' | 'owned';
export type Diet = 'plant-based' | 'vegetarian' | 'mixed';
export type Budget = 'free-only' | 'low' | 'flexible';
export type Category = 'transport' | 'food' | 'energy';
export type Confidence = 'low' | 'medium' | 'high';
export type TransportMode = 'walk' | 'bicycle' | 'bus' | 'metro' | 'motorbike' | 'car' | 'taxi';
export type FoodType = 'plant-based' | 'vegetarian' | 'chicken' | 'red-meat' | 'packaged';

export interface Profile {
  housing: Housing;
  householdSize: number;
  diet: Diet;
  budget: Budget;
  goal: 'learn' | 'reduce' | 'track';
}

interface BaseActivity {
  id: string;
  date: string;
  category: Category;
}

export interface TransportActivity extends BaseActivity {
  category: 'transport';
  mode: TransportMode;
  distanceKm: number;
  passengers: number;
}

export interface FoodActivity extends BaseActivity {
  category: 'food';
  foodType: FoodType;
  meals: number;
}

export interface EnergyActivity extends BaseActivity {
  category: 'energy';
  kwh: number;
  sharedHousehold: boolean;
}

export type Activity = TransportActivity | FoodActivity | EnergyActivity;

export type WeeklyActionStatus = 'active' | 'completed' | 'skipped';

export interface WeeklyAction {
  id: string;
  recommendationId: string;
  title: string;
  category: Category;
  weeklySavingKg: number;
  startedOn: string;
  status: WeeklyActionStatus;
  completedOn?: string;
}

export interface AppState {
  profile: Profile | null;
  activities: Activity[];
  weeklyAction?: WeeklyAction | null;
  mode?: 'personal' | 'demo';
}

export interface EmissionResult {
  activityId: string;
  category: Category;
  kgCo2e: number;
  confidence: Confidence;
  explanation: string;
}

export interface CategorySummary {
  category: Category;
  kgCo2e: number;
  share: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  rationale: string;
  category: Category;
  estimatedWeeklySavingKg: number;
  cost: 'free' | 'low' | 'medium';
  effort: 'easy' | 'moderate' | 'hard';
  confidence: Confidence;
  priority: number;
}

export interface Scenario {
  id: string;
  label: string;
  description: string;
  weeklySavingKg: number;
  annualSavingKg: number;
}
export interface DailyFootprint {
  date: string;
  label: string;
  kgCo2e: number;
  activityCount: number;
}

export interface TrendSummary {
  days: DailyFootprint[];
  currentTotalKg: number;
  previousTotalKg: number;
  changePercent: number | null;
  activeDays: number;
  averagePerActiveDayKg: number;
}
