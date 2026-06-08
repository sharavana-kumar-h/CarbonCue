import { useState } from 'react';
import { Database, Leaf, RotateCcw } from 'lucide-react';
import { ActivityList } from './components/ActivityList';
import { ActivityLogger } from './components/ActivityLogger';
import { Dashboard } from './components/Dashboard';
import { Coach } from './components/Coach';
import { Onboarding } from './components/Onboarding';
import { ProgressTrend } from './components/ProgressTrend';
import { Recommendations } from './components/Recommendations';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { ELECTRICITY_FACTOR, FOOD_FACTORS, TRANSPORT_FACTORS } from './data/emissionFactors';
import { useCarbonData } from './hooks/useCarbonData';

type View = 'dashboard' | 'methodology';

function App() {
  const data = useCarbonData();
  const [view, setView] = useState<View>('dashboard');
  const [confirmReset, setConfirmReset] = useState(false);

  if (!data.state.profile) {
    return <Onboarding onComplete={data.setProfile} onDemo={data.loadDemo} />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <a className="brand" href="#top" aria-label="CarbonCue home"><span className="brand-icon"><Leaf size={20} /></span><span>CarbonCue</span></a>
        <nav aria-label="Primary navigation">
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>Dashboard</button>
          <button className={view === 'methodology' ? 'active' : ''} onClick={() => setView('methodology')}>Methodology</button>
        </nav>
        <button className="reset-button" onClick={() => setConfirmReset(true)}><RotateCcw size={16} /> Reset</button>
      </header>

      <main id="main-content" className="content" tabIndex={-1}>
        {view === 'dashboard' ? (
          <>
            {data.isDemo && (
              <aside className="demo-banner" aria-label="Sample data notice">
                <div>
                  <strong>Sample workspace</strong>
                  <span>This dashboard contains two weeks of fictional activity data for evaluation.</span>
                </div>
                <button type="button" onClick={data.reset}>Start with my own data</button>
              </aside>
            )}
            <section className="page-intro" id="top">
              <div><p className="eyebrow">Personal footprint workspace</p><h1>See the pattern. Pick one useful change.</h1></div>
              <p>Data stays on this device. Estimates show assumptions instead of hiding them.</p>
            </section>
            <Dashboard total={data.total} confidence={data.confidence} summaries={data.summaries} activityCount={data.state.activities.length} potentialWeeklySaving={data.recommendations[0]?.estimatedWeeklySavingKg ?? 0} />
            <ProgressTrend trend={data.trend} />
            <div className="main-grid">
              <div className="main-column">
                <ActivityLogger onAdd={data.addActivity} />
                <Coach activities={data.state.activities} results={data.results} summaries={data.summaries} recommendations={data.recommendations} confidence={data.confidence} />
                <Recommendations recommendations={data.recommendations} />
                <ActivityList activities={data.state.activities} results={data.results} onRemove={data.removeActivity} />
              </div>
              <aside className="side-column">
                <ScenarioSimulator profile={data.state.profile} activities={data.state.activities} />
                <section className="panel privacy-panel">
                  <Database size={22} />
                  <h2>Local-first privacy</h2>
                  <p>Your profile and activities are stored only in this browser. No account, analytics SDK or backend is required.</p>
                  <button className="text-button aligned" onClick={() => setView('methodology')}>Inspect assumptions</button>
                </section>
              </aside>
            </div>
          </>
        ) : (
          <Methodology />
        )}
      </main>

      <footer><span>CarbonCue · Educational carbon awareness prototype</span><span>Private by default · Explainable by design</span></footer>

      {confirmReset && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setConfirmReset(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="reset-title" onMouseDown={(event) => event.stopPropagation()}>
            <h2 id="reset-title">Delete all local data?</h2>
            <p>This removes the profile and activities saved by CarbonCue in this browser.</p>
            <div className="modal-actions"><button className="text-button" onClick={() => setConfirmReset(false)}>Cancel</button><button className="danger-button" onClick={() => { data.reset(); setConfirmReset(false); }}>Delete data</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function Methodology() {
  const transportEntries = Object.entries(TRANSPORT_FACTORS);
  const foodEntries = Object.entries(FOOD_FACTORS);
  return (
    <section className="methodology-page">
      <div className="page-intro"><div><p className="eyebrow">Open methodology</p><h1>Every estimate has an assumption.</h1></div><p>CarbonCue is an awareness tool—not a verified inventory or offset certificate.</p></div>
      <article className="panel prose-panel">
        <h2>Calculation</h2>
        <p>Each estimate multiplies the recorded activity by an emission factor. Shared vehicle and household activities may then be allocated across people. The interface rounds results because fine-grained precision would be misleading.</p>
        <pre><code>estimated kg CO₂e = activity quantity × factor ÷ allocation</code></pre>
        <h2>Electricity</h2>
        <div className="factor-card"><strong>{ELECTRICITY_FACTOR.label}</strong><span>{ELECTRICITY_FACTOR.factor} {ELECTRICITY_FACTOR.unit}</span><p>{ELECTRICITY_FACTOR.source}, {ELECTRICITY_FACTOR.sourceYear}. {ELECTRICITY_FACTOR.notes}</p></div>
        <h2>Transport factors</h2>
        <div className="factor-grid">{transportEntries.map(([key, value]) => <div className="factor-card" key={key}><strong>{value.label}</strong><span>{value.factor} {value.unit}</span><p>{value.source}, {value.sourceYear}. {value.notes}</p></div>)}</div>
        <h2>Food estimates</h2>
        <p>Meal-level factors are deliberately broad. Food footprints vary dramatically by ingredient, farm, processing, portion and waste, so CarbonCue labels these estimates medium or low confidence.</p>
        <div className="factor-grid">{foodEntries.map(([key, value]) => <div className="factor-card" key={key}><strong>{value.label}</strong><span>{value.factor} {value.unit}</span><p>{value.source}, {value.sourceYear}. {value.notes}</p></div>)}</div>
        <h2>Recommendation ranking</h2>
        <p>Actions are ranked using estimated savings, feasibility, profile match, confidence, budget and effort. The engine also removes irrelevant recommendations—for example, meat-reduction advice for vegetarian users and expensive infrastructure-first advice for renters.</p>
      </article>
    </section>
  );
}

export default App;
