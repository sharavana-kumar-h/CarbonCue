import { BadgeIndianRupee, ChevronRight, CircleHelp, Gauge } from 'lucide-react';
import type { Recommendation } from '../types';

interface Props { recommendations: Recommendation[]; }

export function Recommendations({ recommendations }: Props) {
  return (
    <section className="panel recommendations-panel" aria-labelledby="recommendations-title">
      <div className="panel-heading">
        <div><p className="eyebrow">Best next moves</p><h2 id="recommendations-title">Ranked for your context</h2></div>
        <span className="microcopy">Impact ÷ effort and cost</span>
      </div>
      {recommendations.length === 0 ? <p className="empty-state">Add at least one activity to receive recommendations.</p> : (
        <div className="recommendation-list">
          {recommendations.map((item, index) => (
            <details className="recommendation-card" key={item.id} open={index === 0}>
              <summary>
                <span className="rank">{index + 1}</span>
                <span className="recommendation-copy"><strong>{item.title}</strong><span>{item.description}</span></span>
                <span className="saving">−{item.estimatedWeeklySavingKg.toFixed(1)} kg/wk</span>
                <ChevronRight className="chevron" size={18} aria-hidden="true" />
              </summary>
              <div className="recommendation-detail">
                <p><CircleHelp size={16} /><span><strong>Why this:</strong> {item.rationale}</span></p>
                <div className="tags"><span><BadgeIndianRupee size={14} /> {item.cost}</span><span><Gauge size={14} /> {item.effort}</span><span>{item.confidence} confidence</span></div>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
