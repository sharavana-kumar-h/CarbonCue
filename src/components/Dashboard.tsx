import { Info, ShieldCheck, TrendingDown } from 'lucide-react';
import type { CategorySummary, Confidence } from '../types';

interface Props {
  total: number;
  confidence: Confidence;
  summaries: CategorySummary[];
  activityCount: number;
  potentialWeeklySaving: number;
}

const labels = { transport: 'Transport', food: 'Food', energy: 'Energy' } as const;

export function Dashboard({ total, confidence, summaries, activityCount, potentialWeeklySaving }: Props) {
  const dominant = [...summaries].sort((a, b) => b.kgCo2e - a.kgCo2e)[0];

  return (
    <>
      <section className="metrics-grid" aria-label="Carbon summary">
        <article className="metric-card primary-metric">
          <div className="metric-top"><span>Recorded footprint</span><span className={`confidence ${confidence}`}>{confidence} confidence</span></div>
          <strong>{total.toFixed(1)} <small>kg CO₂e</small></strong>
          <p>Across {activityCount} recorded activit{activityCount === 1 ? 'y' : 'ies'}.</p>
        </article>
        <article className="metric-card">
          <span>Largest source</span>
          <strong className="text-value">{dominant && dominant.kgCo2e > 0 ? labels[dominant.category] : 'Add data'}</strong>
          <p>{dominant && dominant.kgCo2e > 0 ? `${dominant.share}% of your recorded estimate` : 'Your first activity will reveal it.'}</p>
        </article>
        <article className="metric-card">
          <span>Top-action potential</span>
          <strong className="comparison positive"><TrendingDown />{potentialWeeklySaving.toFixed(1)} kg</strong>
          <p>Estimated weekly reduction from your highest-ranked action.</p>
        </article>
      </section>

      <section className="panel breakdown-panel" aria-labelledby="breakdown-title">
        <div className="panel-heading">
          <div><p className="eyebrow">Your pattern</p><h2 id="breakdown-title">Where the estimate comes from</h2></div>
          <span className="source-note"><ShieldCheck size={16} /> Transparent factors</span>
        </div>
        <div className="breakdown-list">
          {summaries.map((item) => (
            <div className="breakdown-row" key={item.category}>
              <div className="breakdown-label"><span>{labels[item.category]}</span><strong>{item.kgCo2e.toFixed(1)} kg</strong></div>
              <div className="bar-track" role="progressbar" aria-label={`${labels[item.category]} share`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={item.share}><span className={`bar-fill ${item.category}`} style={{ width: `${item.share}%` }} /></div>
              <span className="share">{item.share}%</span>
            </div>
          ))}
        </div>
        <p className="disclaimer"><Info size={15} /> Educational estimates, not certified carbon accounting. Factors vary by vehicle, region, ingredients, occupancy and time.</p>
      </section>
    </>
  );
}
