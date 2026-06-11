import { CheckCircle2, Flag, RotateCcw, Target, XCircle } from 'lucide-react';
import { filterToLatestWindow } from '../engine/trends';
import type { Activity, Recommendation, WeeklyAction as WeeklyActionType, WeeklyActionStatus } from '../types';

interface Props {
  weeklyAction?: WeeklyActionType | null;
  recommendations: Recommendation[];
  activities: Activity[];
  onCommit: (recommendation: Recommendation) => void;
  onUpdateStatus: (status: WeeklyActionStatus) => void;
}

const categoryLabels = {
  transport: 'transport',
  food: 'food',
  energy: 'energy'
} as const;

function countRecentRelevantActivities(action: WeeklyActionType | null | undefined, activities: Activity[]): number {
  if (!action || action.status !== 'active') return 0;
  return filterToLatestWindow(activities).filter((activity) => activity.category === action.category).length;
}

export function WeeklyAction({ weeklyAction, recommendations, activities, onCommit, onUpdateStatus }: Props) {
  const topRecommendation = recommendations[0];
  const relevantCount = countRecentRelevantActivities(weeklyAction, activities);

  return (
    <section className="panel weekly-action-panel" aria-labelledby="weekly-action-title">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Behavior loop</p>
          <h2 id="weekly-action-title">Weekly action commitment</h2>
        </div>
        <span className="source-note"><Target size={16} /> Track one change</span>
      </div>

      {!weeklyAction && (
        <div className="weekly-action-empty">
          <p>Pick one ranked action and treat it as this week’s commitment. CarbonCue then tracks completion instead of leaving the recommendation as passive advice.</p>
          {topRecommendation ? (
            <button type="button" className="secondary-button" onClick={() => onCommit(topRecommendation)}>
              <Flag size={16} /> Commit to “{topRecommendation.title}”
            </button>
          ) : (
            <p className="empty-state">Add an activity first so CarbonCue can suggest a realistic commitment.</p>
          )}
        </div>
      )}

      {weeklyAction && (
        <div className={`weekly-action-card ${weeklyAction.status}`}>
          <div className="weekly-action-copy">
            <span className="action-status">{weeklyAction.status === 'active' ? 'Active this week' : weeklyAction.status}</span>
            <h3>{weeklyAction.title}</h3>
            <p>
              Estimated potential: {weeklyAction.weeklySavingKg.toFixed(1)} kg CO₂e/week · Category: {categoryLabels[weeklyAction.category]} · Started {weeklyAction.startedOn}
            </p>
          </div>

          {weeklyAction.status === 'active' && relevantCount > 0 && (
            <div className="context-nudge" role="status">
              <strong>Contextual nudge:</strong> You logged {relevantCount} {categoryLabels[weeklyAction.category]} activit{relevantCount === 1 ? 'y' : 'ies'} in the latest seven-day window. Try the committed action before your next similar choice, then mark it complete.
            </div>
          )}

          {weeklyAction.status === 'active' ? (
            <div className="weekly-action-buttons">
              <button type="button" className="secondary-button" onClick={() => onUpdateStatus('completed')}>
                <CheckCircle2 size={16} /> Mark completed
              </button>
              <button type="button" className="text-button compact" onClick={() => onUpdateStatus('skipped')}>
                <XCircle size={16} /> Skip this week
              </button>
            </div>
          ) : (
            <div className="weekly-action-buttons">
              {topRecommendation && (
                <button type="button" className="secondary-button" onClick={() => onCommit(topRecommendation)}>
                  <RotateCcw size={16} /> Start a new action
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
