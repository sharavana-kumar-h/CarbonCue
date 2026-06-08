import { Trash2 } from 'lucide-react';
import type { Activity, EmissionResult } from '../types';

interface Props { activities: Activity[]; results: EmissionResult[]; onRemove: (id: string) => void; }

function label(activity: Activity): string {
  if (activity.category === 'transport') return `${activity.mode} · ${activity.distanceKm} km`;
  if (activity.category === 'food') return `${activity.foodType} · ${activity.meals} meal${activity.meals === 1 ? '' : 's'}`;
  return `electricity · ${activity.kwh} kWh`;
}

export function ActivityList({ activities, results, onRemove }: Props) {
  const recentActivities = [...activities]
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, 8);

  return (
    <section className="panel activity-list-panel" aria-labelledby="activity-title">
      <div className="panel-heading"><div><p className="eyebrow">Audit trail</p><h2 id="activity-title">Recent activities</h2></div><span className="microcopy">By activity date</span></div>
      {activities.length === 0 ? <p className="empty-state">Nothing logged yet.</p> : (
        <ul className="activity-list">
          {recentActivities.map((activity) => {
            const result = results.find((item) => item.activityId === activity.id);
            return <li key={activity.id}>
              <span className={`category-dot ${activity.category}`} aria-hidden="true" />
              <span className="activity-copy"><strong>{label(activity)}</strong><small>{activity.date} · {result?.explanation}</small></span>
              <strong>{result?.kgCo2e.toFixed(1)} kg</strong>
              <button className="icon-button" onClick={() => onRemove(activity.id)} aria-label={`Remove ${label(activity)}`}><Trash2 size={16} /></button>
            </li>;
          })}
        </ul>
      )}
    </section>
  );
}
