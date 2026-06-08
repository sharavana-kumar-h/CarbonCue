import { ArrowDownRight, ArrowUpRight, CalendarDays, Minus } from 'lucide-react';
import type { TrendSummary } from '../types';

interface Props {
  trend: TrendSummary;
}

function Comparison({ changePercent }: { changePercent: number | null }) {
  if (changePercent === null) {
    return <span className="trend-badge neutral"><CalendarDays size={15} /> Build a second week to compare</span>;
  }

  if (Math.abs(changePercent) < 0.1) {
    return <span className="trend-badge neutral"><Minus size={15} /> Level with last week</span>;
  }

  if (changePercent < 0) {
    return <span className="trend-badge positive"><ArrowDownRight size={15} /> {Math.abs(changePercent).toFixed(1)}% lower than last week</span>;
  }

  return <span className="trend-badge negative"><ArrowUpRight size={15} /> {changePercent.toFixed(1)}% higher than last week</span>;
}

export function ProgressTrend({ trend }: Props) {
  const maximum = Math.max(1, ...trend.days.map((day) => day.kgCo2e));

  return (
    <section className="panel progress-panel" aria-labelledby="progress-title">
      <div className="panel-heading progress-heading">
        <div><p className="eyebrow">Seven-day progress</p><h2 id="progress-title">Is the pattern improving?</h2></div>
        <Comparison changePercent={trend.changePercent} />
      </div>

      <div className="trend-layout">
        <div className="trend-chart" role="list" aria-label="Daily carbon footprint for the last seven days">
          {trend.days.map((day) => {
            const height = day.kgCo2e > 0 ? Math.max(8, (day.kgCo2e / maximum) * 100) : 2;
            return (
              <div className="trend-day" role="listitem" key={day.date}>
                <div className="trend-value">{day.kgCo2e > 0 ? day.kgCo2e.toFixed(1) : '0'}</div>
                <div className="trend-bar-track" aria-hidden="true"><span className="trend-bar" style={{ height: `${height}%` }} /></div>
                <strong>{day.label}</strong>
                <span>{day.date.slice(5)}</span>
              </div>
            );
          })}
        </div>

        <dl className="trend-stats">
          <div><dt>Current 7 days</dt><dd>{trend.currentTotalKg.toFixed(1)} kg</dd></div>
          <div><dt>Days recorded</dt><dd>{trend.activeDays} / 7</dd></div>
          <div><dt>Average active day</dt><dd>{trend.averagePerActiveDayKg.toFixed(1)} kg</dd></div>
        </dl>
      </div>
      <p className="trend-note">A lower total only means improvement when similar activities were recorded in both periods. Missing days are shown as zero, not assumed to be zero-emission days.</p>
    </section>
  );
}
