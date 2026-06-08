import { TRANSPORT_FACTORS } from '../data/emissionFactors';
import { filterToLatestWindow } from './trends';
import type { Activity, Profile, Scenario, TransportActivity } from '../types';

interface ScenarioDraft extends Omit<Scenario, 'annualSavingKg'> {}

function transportPerKm(activity: TransportActivity): number {
  const factor = TRANSPORT_FACTORS[activity.mode].factor;
  if (activity.mode === 'car' || activity.mode === 'motorbike') {
    return factor / Math.max(1, activity.passengers);
  }
  return factor;
}

export function buildScenarios(profile: Profile, activities: Activity[]): Scenario[] {
  const options: ScenarioDraft[] = [];
  const recentActivities = filterToLatestWindow(activities);
  const roadTrips = recentActivities.filter(
    (activity): activity is TransportActivity => activity.category === 'transport' && ['car', 'taxi'].includes(activity.mode)
  );
  const roadKm = roadTrips.reduce((sum, activity) => sum + activity.distanceKm, 0);

  if (roadKm > 0) {
    const weightedFactor = roadTrips.reduce(
      (sum, activity) => sum + transportPerKm(activity) * activity.distanceKm,
      0
    ) / roadKm;
    const shiftKm = Math.min(20, roadKm);
    const saving = Math.max(0, shiftKm * (weightedFactor - TRANSPORT_FACTORS.metro.factor));

    if (saving > 0.05) {
      options.push({
        id: 'road-to-metro',
        label: `Move ${Math.round(shiftKm)} km from car or cab`,
        description: 'Uses your recorded road-travel intensity and the disclosed metro proxy.',
        weeklySavingKg: saving
      });
    }
  }

  const carTrips = roadTrips.filter((activity) => activity.mode === 'car');
  const carKm = carTrips.reduce((sum, activity) => sum + activity.distanceKm, 0);
  if (carKm > 0) {
    const targetKm = Math.min(30, carKm);
    const averageCurrentOccupancy = carTrips.reduce(
      (sum, activity) => sum + activity.passengers * activity.distanceKm,
      0
    ) / carKm;
    const currentPerKm = TRANSPORT_FACTORS.car.factor / Math.max(1, averageCurrentOccupancy);
    const sharedPerKm = TRANSPORT_FACTORS.car.factor / Math.max(2, averageCurrentOccupancy + 1);

    options.push({
      id: 'carpool',
      label: `Share ${Math.round(targetKm)} km of car travel`,
      description: 'Adds one occupant to the average occupancy of your recorded car journeys.',
      weeklySavingKg: Math.max(0, targetKm * (currentPerKm - sharedPerKm))
    });
  }

  const redMeatMeals = recentActivities
    .filter((activity) => activity.category === 'food' && activity.foodType === 'red-meat')
    .reduce((sum, activity) => sum + (activity.category === 'food' ? activity.meals : 0), 0);
  if (profile.diet === 'mixed' && redMeatMeals > 0) {
    options.push({
      id: 'red-meat-swap',
      label: 'Swap one recorded red-meat meal',
      description: 'Compares the broad red-meat and vegetarian meal estimates.',
      weeklySavingKg: 5.5 - 1.2
    });
  }

  const energyEntries = recentActivities.filter((activity) => activity.category === 'energy');
  const energyKwh = energyEntries.reduce(
    (sum, activity) => sum + (activity.category === 'energy' ? activity.kwh : 0),
    0
  );
  if (energyKwh > 0) {
    const targetKwh = Math.min(5, Math.max(1, energyKwh * 0.2));
    const shared = energyEntries.some((activity) => activity.category === 'energy' && activity.sharedHousehold);
    const divisor = shared ? Math.max(1, profile.householdSize) : 1;
    options.push({
      id: 'energy-reduction',
      label: `Use ${targetKwh.toFixed(1)} kWh less`,
      description: shared
        ? 'Uses the Indian grid factor and your household allocation setting.'
        : 'Uses the Indian grid-average electricity factor.',
      weeklySavingKg: targetKwh * 0.710 / divisor
    });
  }

  options.push({
    id: 'food-waste',
    label: 'Plan one leftovers meal',
    description: 'A low-confidence directional estimate for avoiding one wasted or unnecessary meal.',
    weeklySavingKg: 1.1
  });

  return options
    .filter((option) => option.weeklySavingKg > 0)
    .map((option) => ({
      ...option,
      weeklySavingKg: Number(option.weeklySavingKg.toFixed(1)),
      annualSavingKg: Number((option.weeklySavingKg * 52).toFixed(0))
    }));
}
