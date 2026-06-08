import type { Activity, DailyFootprint, EmissionResult, TrendSummary } from '../types';

const DAY_MS = 86_400_000;
const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function round(value: number, precision = 1): number {
  const power = 10 ** precision;
  return Math.round(value * power) / power;
}

function parseIsoDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

export function currentLocalIsoDate(now = new Date()): string {
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localTime.toISOString().slice(0, 10);
}

export function shiftIsoDate(date: string, offsetDays: number): string {
  const shifted = new Date(parseIsoDate(date).getTime() + offsetDays * DAY_MS);
  return shifted.toISOString().slice(0, 10);
}

function createWindow(
  endDate: string,
  days: number,
  totalsByDate: Map<string, { kgCo2e: number; activityCount: number }>
): DailyFootprint[] {
  return Array.from({ length: days }, (_, index) => {
    const date = shiftIsoDate(endDate, index - days + 1);
    const totals = totalsByDate.get(date) ?? { kgCo2e: 0, activityCount: 0 };
    return {
      date,
      label: WEEKDAY_LABELS[parseIsoDate(date).getUTCDay()],
      kgCo2e: round(totals.kgCo2e),
      activityCount: totals.activityCount
    };
  });
}


export function filterToLatestWindow(activities: Activity[], windowDays = 7): Activity[] {
  if (!activities.length) return [];
  const latestDate = activities.reduce(
    (latest, activity) => activity.date > latest ? activity.date : latest,
    activities[0].date
  );
  const startDate = shiftIsoDate(latestDate, -(windowDays - 1));
  return activities.filter((activity) => activity.date >= startDate && activity.date <= latestDate);
}

export function buildTrendSummary(
  activities: Activity[],
  results: EmissionResult[],
  endDate = currentLocalIsoDate(),
  windowDays = 7
): TrendSummary {
  const resultByActivity = new Map(results.map((result) => [result.activityId, result.kgCo2e]));
  const totalsByDate = new Map<string, { kgCo2e: number; activityCount: number }>();

  for (const activity of activities) {
    const emission = resultByActivity.get(activity.id);
    if (emission === undefined) continue;
    const current = totalsByDate.get(activity.date) ?? { kgCo2e: 0, activityCount: 0 };
    totalsByDate.set(activity.date, {
      kgCo2e: current.kgCo2e + emission,
      activityCount: current.activityCount + 1
    });
  }

  const days = createWindow(endDate, windowDays, totalsByDate);
  const previousEndDate = shiftIsoDate(endDate, -windowDays);
  const previousDays = createWindow(previousEndDate, windowDays, totalsByDate);
  const currentTotalKg = round(days.reduce((sum, day) => sum + day.kgCo2e, 0));
  const previousTotalKg = round(previousDays.reduce((sum, day) => sum + day.kgCo2e, 0));
  const activeDays = days.filter((day) => day.activityCount > 0).length;
  const changePercent = previousTotalKg > 0
    ? round(((currentTotalKg - previousTotalKg) / previousTotalKg) * 100)
    : null;

  return {
    days,
    currentTotalKg,
    previousTotalKg,
    changePercent,
    activeDays,
    averagePerActiveDayKg: activeDays > 0 ? round(currentTotalKg / activeDays) : 0
  };
}
