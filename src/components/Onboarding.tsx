import { useState } from 'react';
import { ArrowRight, Leaf, LockKeyhole, Sparkles } from 'lucide-react';
import type { Budget, Diet, Housing, Profile } from '../types';

interface Props {
  onComplete: (profile: Profile) => void;
  onDemo: () => void;
}

export function Onboarding({ onComplete, onDemo }: Props) {
  const [profile, setProfile] = useState<Profile>({
    housing: 'rented',
    householdSize: 3,
    diet: 'vegetarian',
    budget: 'low',
    goal: 'reduce'
  });

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  return (
    <main className="onboarding" id="main-content">
      <section className="hero-panel">
        <div className="brand-mark"><Leaf aria-hidden="true" /><span>CarbonCue</span></div>
        <div className="hero-copy">
          <p className="eyebrow">An explainable personal carbon coach</p>
          <h1>Change what matters, not everything.</h1>
          <p className="hero-lead">Track everyday choices, see what drives your estimate and get actions ranked by impact, effort and your real constraints.</p>
        </div>
        <div className="trust-grid">
          <div><Sparkles aria-hidden="true" /><span><strong>Context-aware</strong> advice instead of generic tips</span></div>
          <div><LockKeyhole aria-hidden="true" /><span><strong>Private by default</strong> with data stored in your browser</span></div>
        </div>
      </section>

      <section className="setup-card" aria-labelledby="setup-title">
        <div>
          <p className="step-label">60-second setup</p>
          <h2 id="setup-title">Tell us what you can control</h2>
          <p className="muted">No account, address or personal identity required.</p>
        </div>

        <form onSubmit={(event) => { event.preventDefault(); onComplete(profile); }}>
          <fieldset>
            <legend>Where do you live?</legend>
            <div className="segmented three">
              {(['hostel', 'rented', 'owned'] as Housing[]).map((value) => (
                <label key={value} className={profile.housing === value ? 'selected' : ''}>
                  <input type="radio" name="housing" value={value} checked={profile.housing === value} onChange={() => update('housing', value)} />
                  <span>{value === 'hostel' ? 'Hostel / PG' : value[0].toUpperCase() + value.slice(1)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="field-label" htmlFor="household">People sharing household electricity</label>
          <input id="household" type="number" min="1" max="20" value={profile.householdSize} onChange={(event) => update('householdSize', Math.min(20, Math.max(1, Number(event.target.value))))} />

          <fieldset>
            <legend>Usual diet</legend>
            <div className="segmented three">
              {(['plant-based', 'vegetarian', 'mixed'] as Diet[]).map((value) => (
                <label key={value} className={profile.diet === value ? 'selected' : ''}>
                  <input type="radio" name="diet" value={value} checked={profile.diet === value} onChange={() => update('diet', value)} />
                  <span>{value === 'plant-based' ? 'Plant-based' : value[0].toUpperCase() + value.slice(1)}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Action budget</legend>
            <div className="segmented three">
              {([
                ['free-only', 'Free only'],
                ['low', 'Low cost'],
                ['flexible', 'Flexible']
              ] as [Budget, string][]).map(([value, label]) => (
                <label key={value} className={profile.budget === value ? 'selected' : ''}>
                  <input type="radio" name="budget" value={value} checked={profile.budget === value} onChange={() => update('budget', value)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>What do you want first?</legend>
            <div className="segmented three">
              {([
                ['learn', 'Understand'],
                ['reduce', 'Reduce'],
                ['track', 'Build a habit']
              ] as [Profile['goal'], string][]).map(([value, label]) => (
                <label key={value} className={profile.goal === value ? 'selected' : ''}>
                  <input type="radio" name="goal" value={value} checked={profile.goal === value} onChange={() => update('goal', value)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <button className="primary-button" type="submit">Build my dashboard <ArrowRight size={18} aria-hidden="true" /></button>
          <button className="text-button" type="button" onClick={onDemo}>Explore with sample data</button>
        </form>
      </section>
    </main>
  );
}
