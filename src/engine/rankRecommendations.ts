import { filterToLatestWindow } from './trends';
import type { Activity, Budget, CategorySummary, Confidence, Profile, Recommendation } from '../types';

interface Candidate extends Omit<Recommendation, 'priority'> {
  feasibility: number;
  preferenceMatch: number;
}

const effortScore = { easy: 1, moderate: 1.6, hard: 2.5 } as const;
const costScore = { free: 0, low: 0.5, medium: 1.5 } as const;
const confidenceScore: Record<Confidence, number> = { low: 0.6, medium: 0.8, high: 1 };

function budgetMatch(cost: Candidate['cost'], budget: Budget): number {
  if (budget === 'free-only') return cost === 'free' ? 1.2 : 0.35;
  if (budget === 'low') return cost === 'medium' ? 0.7 : 1.1;
  return 1;
}

function goalMatch(candidate: Candidate, profile: Profile): number {
  if (profile.goal === 'learn') {
    return candidate.confidence === 'high' ? 1.15 : candidate.confidence === 'low' ? 0.75 : 1;
  }
  if (profile.goal === 'track') {
    return candidate.effort === 'easy' ? 1.15 : candidate.effort === 'hard' ? 0.7 : 1;
  }
  return 1;
}

function priority(candidate: Candidate, profile: Profile): number {
  const denominator = effortScore[candidate.effort] + costScore[candidate.cost];
  return Number((
    candidate.estimatedWeeklySavingKg *
    candidate.feasibility *
    candidate.preferenceMatch *
    budgetMatch(candidate.cost, profile.budget) *
    goalMatch(candidate, profile) *
    confidenceScore[candidate.confidence]
  / denominator).toFixed(3));
}

export function rankRecommendations(
  profile: Profile,
  activities: Activity[],
  summaries: CategorySummary[]
): Recommendation[] {
  const topCategory = [...summaries].sort((a, b) => b.kgCo2e - a.kgCo2e)[0]?.category ?? 'transport';
  const recentActivities = filterToLatestWindow(activities);
  const carKm = recentActivities
    .filter((item) => item.category === 'transport' && ['car', 'taxi'].includes(item.mode))
    .reduce((sum, item) => sum + (item.category === 'transport' ? item.distanceKm : 0), 0);
  const redMeatMeals = recentActivities
    .filter((item) => item.category === 'food' && item.foodType === 'red-meat')
    .reduce((sum, item) => sum + (item.category === 'food' ? item.meals : 0), 0);
  const energyKwh = recentActivities
    .filter((item) => item.category === 'energy')
    .reduce((sum, item) => sum + (item.category === 'energy' ? item.kwh : 0), 0);

  const candidates: Candidate[] = [];

  if (carKm > 0) {
    const replaceKm = Math.min(20, Math.max(5, carKm * 0.3));
    candidates.push({
      id: 'replace-car-metro',
      title: 'Replace two car or cab trips',
      description: `Shift about ${Math.round(replaceKm)} km this week to metro, bus, cycling or walking where practical.`,
      rationale: topCategory === 'transport'
        ? 'Transport is currently your largest recorded category, so reducing high-emission kilometres attacks the dominant source.'
        : 'You recorded car or taxi travel, which is a controllable source with a measurable lower-carbon substitute.',
      category: 'transport',
      estimatedWeeklySavingKg: Number((replaceKm * (0.17304 - 0.0286)).toFixed(1)),
      cost: 'low',
      effort: 'moderate',
      confidence: 'medium',
      feasibility: 0.9,
      preferenceMatch: 1
    });
    candidates.push({
      id: 'carpool',
      title: 'Share the highest-distance ride',
      description: 'Carpool one recurring journey with one additional passenger.',
      rationale: 'The car factor is allocated across occupants, so increasing occupancy reduces the per-person estimate without eliminating the journey.',
      category: 'transport',
      estimatedWeeklySavingKg: Number((Math.min(30, carKm) * 0.17304 * 0.5).toFixed(1)),
      cost: 'free',
      effort: 'easy',
      confidence: 'medium',
      feasibility: 0.85,
      preferenceMatch: 1
    });
  }

  if (profile.diet === 'mixed' && redMeatMeals > 0) {
    candidates.push({
      id: 'swap-red-meat',
      title: 'Swap one red-meat meal',
      description: 'Replace one red-meat meal with a vegetarian or plant-based meal this week.',
      rationale: 'Your log contains a high-intensity meal category. A single substitution can outperform several small packaging changes.',
      category: 'food',
      estimatedWeeklySavingKg: 4.3,
      cost: 'low',
      effort: 'easy',
      confidence: 'medium',
      feasibility: 0.95,
      preferenceMatch: 1
    });
  } else {
    candidates.push({
      id: 'prevent-food-waste',
      title: 'Plan one leftovers meal',
      description: 'Use ingredients already at home for one meal before buying or ordering more food.',
      rationale: profile.diet === 'vegetarian' || profile.diet === 'plant-based'
        ? 'A meat-reduction prompt would not match your diet. Avoiding wasted food is the more relevant no-cost action.'
        : 'This is a low-cost action that does not require a major dietary change.',
      category: 'food',
      estimatedWeeklySavingKg: 1.1,
      cost: 'free',
      effort: 'easy',
      confidence: 'low',
      feasibility: 1,
      preferenceMatch: 1.1
    });
  }

  if (energyKwh > 0) {
    candidates.push({
      id: 'reduce-energy',
      title: 'Cut 5 kWh this week',
      description: 'Choose one repeatable measure: shorten AC use, raise the set point, air-dry clothes or switch off standby loads.',
      rationale: `At the current India grid factor, 5 kWh represents about ${(5 * 0.710).toFixed(1)} kg CO₂e before household allocation.`,
      category: 'energy',
      estimatedWeeklySavingKg: 3.55 / Math.max(1, profile.householdSize),
      cost: 'free',
      effort: 'easy',
      confidence: 'high',
      feasibility: 0.9,
      preferenceMatch: topCategory === 'energy' ? 1.2 : 0.9
    });
  }

  if (profile.housing === 'owned') {
    candidates.push({
      id: 'energy-audit',
      title: 'Check one high-load appliance',
      description: 'Compare the rated power and weekly run-time of the AC, water heater or refrigerator.',
      rationale: 'Owned housing gives you more control over appliance replacement, but measuring usage should come before spending money.',
      category: 'energy',
      estimatedWeeklySavingKg: 1.8,
      cost: 'free',
      effort: 'moderate',
      confidence: 'medium',
      feasibility: 0.85,
      preferenceMatch: 1
    });
  }

  return candidates
    .map((candidate) => ({ ...candidate, priority: priority(candidate, profile) }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 4);
}
