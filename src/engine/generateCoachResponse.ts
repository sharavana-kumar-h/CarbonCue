import type {
  Activity,
  CategorySummary,
  Confidence,
  EmissionResult,
  Recommendation
} from '../types';

export type CoachQuestion = 'next' | 'largest' | 'free' | 'confidence';

export interface CoachResponse {
  heading: string;
  body: string;
  evidence: string;
}

const categoryLabels = {
  transport: 'transport',
  food: 'food',
  energy: 'household energy'
} as const;

function formatSaving(value: number): string {
  return `${value.toFixed(1)} kg CO₂e per week`;
}

export function generateCoachResponse(
  question: CoachQuestion,
  activities: Activity[],
  results: EmissionResult[],
  summaries: CategorySummary[],
  recommendations: Recommendation[],
  overallConfidence: Confidence
): CoachResponse {
  const total = results.reduce((sum, result) => sum + result.kgCo2e, 0);
  const dominant = [...summaries].sort((a, b) => b.kgCo2e - a.kgCo2e)[0];
  const topAction = recommendations[0];

  if (question === 'next') {
    if (!activities.length || !topAction) {
      return {
        heading: 'Log one normal day first',
        body: 'Add your usual commute, meals and electricity use. One representative day gives the coach enough evidence to rank a useful first action.',
        evidence: 'No recorded activities are available yet, so a high-impact recommendation would be guesswork.'
      };
    }

    return {
      heading: topAction.title,
      body: `${topAction.description} The directional saving is about ${formatSaving(topAction.estimatedWeeklySavingKg)}.`,
      evidence: topAction.rationale
    };
  }

  if (question === 'largest') {
    if (!dominant || dominant.kgCo2e <= 0) {
      return {
        heading: 'There is not enough data yet',
        body: 'Add at least one activity before comparing categories.',
        evidence: 'A category cannot be labelled “largest” when every recorded estimate is zero.'
      };
    }

    return {
      heading: `${categoryLabels[dominant.category]} is currently largest`,
      body: `It contributes ${dominant.kgCo2e.toFixed(1)} kg CO₂e, or about ${dominant.share}% of the ${total.toFixed(1)} kg recorded estimate.`,
      evidence: 'This comparison only covers activities entered in this browser; it is not a complete annual household inventory.'
    };
  }

  if (question === 'free') {
    const freeAction = recommendations.find((item) => item.cost === 'free');
    if (!freeAction) {
      return {
        heading: 'No evidence-backed free action yet',
        body: 'Add more activity data so the engine can find a no-cost action linked to something you actually recorded.',
        evidence: 'CarbonCue avoids inventing a generic action when the user context does not support one.'
      };
    }

    return {
      heading: freeAction.title,
      body: `${freeAction.description} Estimated directional saving: ${formatSaving(freeAction.estimatedWeeklySavingKg)}.`,
      evidence: freeAction.rationale
    };
  }

  if (!results.length) {
    return {
      heading: 'Confidence cannot be scored yet',
      body: 'Once activities are recorded, CarbonCue scores confidence from the specificity and quality of the factor used for each estimate.',
      evidence: 'Exact kWh is generally stronger evidence than a broad meal category, while international transport proxies remain medium confidence.'
    };
  }

  const counts: Record<Confidence, number> = { low: 0, medium: 0, high: 0 };
  results.forEach((result) => { counts[result.confidence] += 1; });

  return {
    heading: `Overall confidence is ${overallConfidence}`,
    body: `${counts.high} high-, ${counts.medium} medium- and ${counts.low} low-confidence entr${results.length === 1 ? 'y' : 'ies'} contribute to the current estimate.`,
    evidence: 'Electricity uses a current Indian grid average; transport uses disclosed international proxies; broad meal estimates vary most by ingredients, portion and sourcing.'
  };
}
