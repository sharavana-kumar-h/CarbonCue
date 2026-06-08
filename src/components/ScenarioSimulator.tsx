import { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';
import { buildScenarios } from '../engine/scenarios';
import type { Activity, Profile } from '../types';

interface Props {
  profile: Profile;
  activities: Activity[];
}

export function ScenarioSimulator({ profile, activities }: Props) {
  const scenarios = useMemo(() => buildScenarios(profile, activities), [profile, activities]);
  const [selected, setSelected] = useState('');
  const [scale, setScale] = useState(1);
  const scenario = scenarios.find((item) => item.id === selected) ?? scenarios[0];

  return (
    <section className="panel simulator-panel" aria-labelledby="simulator-title">
      <div className="panel-heading"><div><p className="eyebrow">What-if simulator</p><h2 id="simulator-title">Test a change before committing</h2></div><Calculator size={21} /></div>
      <label>Scenario<select value={scenario.id} onChange={(event) => setSelected(event.target.value)}>{scenarios.map((item) => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
      <label>Repeat per week: <strong>{scale}×</strong><input className="range" type="range" min="1" max="5" value={scale} onChange={(event) => setScale(Number(event.target.value))} /></label>
      <div className="scenario-result"><span>Potential reduction</span><strong>{(scenario.weeklySavingKg * scale).toFixed(1)} kg <small>CO₂e / week</small></strong><p>≈ {(scenario.annualSavingKg * scale).toFixed(0)} kg per year</p></div>
      <p className="microcopy">{scenario.description} This is a directional comparison, not a guarantee.</p>
    </section>
  );
}
