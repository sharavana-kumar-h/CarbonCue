import { useState } from 'react';
import { BusFront, Utensils, Zap } from 'lucide-react';
import { currentLocalIsoDate } from '../engine/trends';
import type { Activity, FoodType, TransportMode } from '../types';

interface Props { onAdd: (activity: Activity) => void; }
type Tab = 'transport' | 'food' | 'energy';

export function ActivityLogger({ onAdd }: Props) {
  const [tab, setTab] = useState<Tab>('transport');
  const [message, setMessage] = useState('');
  const [activityDate, setActivityDate] = useState(currentLocalIsoDate());
  const [transport, setTransport] = useState({ mode: 'metro' as TransportMode, distanceKm: 10, passengers: 1 });
  const [food, setFood] = useState({ foodType: 'vegetarian' as FoodType, meals: 1 });
  const [energy, setEnergy] = useState({ kwh: 5, sharedHousehold: true });

  const confirm = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 2200);
  };

  return (
    <section className="panel logger-panel" aria-labelledby="log-title">
      <div className="panel-heading">
        <div><p className="eyebrow">Add activity</p><h2 id="log-title">What did you use?</h2></div>
        <span className="microcopy">Approximate values are fine</span>
      </div>
      <div className="activity-date-row">
        <label htmlFor="activity-date">Activity date</label>
        <input id="activity-date" type="date" max={currentLocalIsoDate()} value={activityDate} required onChange={(event) => setActivityDate(event.target.value)} />
        <span>Use a past date to complete your weekly pattern.</span>
      </div>
      <div className="tabs" role="group" aria-label="Activity category">
        <button type="button" aria-pressed={tab === 'transport'} className={tab === 'transport' ? 'active' : ''} onClick={() => setTab('transport')}><BusFront size={17} /> Transport</button>
        <button type="button" aria-pressed={tab === 'food'} className={tab === 'food' ? 'active' : ''} onClick={() => setTab('food')}><Utensils size={17} /> Food</button>
        <button type="button" aria-pressed={tab === 'energy'} className={tab === 'energy' ? 'active' : ''} onClick={() => setTab('energy')}><Zap size={17} /> Energy</button>
      </div>

      {tab === 'transport' && (
        <form className="inline-form" onSubmit={(event) => {
          event.preventDefault();
          if (!activityDate || transport.distanceKm <= 0) return;
          onAdd({ id: crypto.randomUUID(), date: activityDate, category: 'transport', ...transport });
          confirm('Transport activity added.');
        }}>
          <label>Mode<select value={transport.mode} onChange={(event) => setTransport({ ...transport, mode: event.target.value as TransportMode })}>
            <option value="walk">Walk</option><option value="bicycle">Bicycle</option><option value="bus">Bus</option><option value="metro">Metro</option><option value="motorbike">Motorbike</option><option value="car">Car</option><option value="taxi">Taxi / cab</option>
          </select></label>
          <label>Distance (km)<input type="number" min="0.1" max="2000" step="0.1" value={transport.distanceKm} onChange={(event) => setTransport({ ...transport, distanceKm: Number(event.target.value) })} /></label>
          {['car', 'motorbike'].includes(transport.mode) && <label>People in vehicle<input type="number" min="1" max="8" value={transport.passengers} onChange={(event) => setTransport({ ...transport, passengers: Number(event.target.value) })} /></label>}
          <button className="secondary-button" type="submit">Add trip</button>
        </form>
      )}

      {tab === 'food' && (
        <form className="inline-form" onSubmit={(event) => {
          event.preventDefault();
          if (!activityDate || food.meals <= 0) return;
          onAdd({ id: crypto.randomUUID(), date: activityDate, category: 'food', ...food });
          confirm('Meal activity added.');
        }}>
          <label>Meal type<select value={food.foodType} onChange={(event) => setFood({ ...food, foodType: event.target.value as FoodType })}>
            <option value="plant-based">Plant-based</option><option value="vegetarian">Vegetarian</option><option value="chicken">Chicken</option><option value="red-meat">Red meat</option><option value="packaged">Packaged / takeaway</option>
          </select></label>
          <label>Meals<input type="number" min="1" max="30" value={food.meals} onChange={(event) => setFood({ ...food, meals: Number(event.target.value) })} /></label>
          <button className="secondary-button" type="submit">Add meals</button>
        </form>
      )}

      {tab === 'energy' && (
        <form className="inline-form" onSubmit={(event) => {
          event.preventDefault();
          if (!activityDate || energy.kwh <= 0) return;
          onAdd({ id: crypto.randomUUID(), date: activityDate, category: 'energy', ...energy });
          confirm('Electricity activity added.');
        }}>
          <label>Electricity (kWh)<input type="number" min="0.1" max="5000" step="0.1" value={energy.kwh} onChange={(event) => setEnergy({ ...energy, kwh: Number(event.target.value) })} /></label>
          <label className="checkbox-label"><input type="checkbox" checked={energy.sharedHousehold} onChange={(event) => setEnergy({ ...energy, sharedHousehold: event.target.checked })} /> Split across household members</label>
          <button className="secondary-button" type="submit">Add energy</button>
        </form>
      )}
      <p className="status-message" aria-live="polite">{message}</p>
    </section>
  );
}
