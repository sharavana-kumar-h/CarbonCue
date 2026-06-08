import { useEffect, useMemo, useState } from 'react';
import { averageConfidence, calculateAllEmissions, calculateTotal, summarizeByCategory } from '../engine/calculateEmissions';
import { rankRecommendations } from '../engine/rankRecommendations';
import { buildTrendSummary } from '../engine/trends';
import { createDemoState } from '../data/demoState';
import { clearState, loadState, saveState } from '../storage/localStorageRepository';
import type { Activity, AppState, Profile } from '../types';

const initialState = (): AppState => {
  if (typeof window === 'undefined') return { profile: null, activities: [] };

  const directDemo = new URLSearchParams(window.location.search).get('demo') === '1';
  if (directDemo) return createDemoState();

  return loadState();
};

export function useCarbonData() {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const results = useMemo(
    () => calculateAllEmissions(state.activities, state.profile),
    [state.activities, state.profile]
  );
  const summaries = useMemo(() => summarizeByCategory(results), [results]);
  const total = useMemo(() => calculateTotal(results), [results]);
  const confidence = useMemo(() => averageConfidence(results), [results]);
  const recommendations = useMemo(
    () => state.profile ? rankRecommendations(state.profile, state.activities, summaries) : [],
    [state.profile, state.activities, summaries]
  );
  const trend = useMemo(
    () => buildTrendSummary(state.activities, results),
    [state.activities, results]
  );

  const setProfile = (profile: Profile) => setState((current) => ({ ...current, profile, mode: 'personal' }));
  const addActivity = (activity: Activity) => setState((current) => ({
    ...current,
    activities: [activity, ...current.activities].slice(0, 250)
  }));
  const removeActivity = (id: string) => setState((current) => ({
    ...current,
    activities: current.activities.filter((activity) => activity.id !== id)
  }));
  const reset = () => {
    clearState();
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('demo')) {
        url.searchParams.delete('demo');
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
      }
    }
    setState({ profile: null, activities: [], mode: 'personal' });
  };
  const loadDemo = () => setState(createDemoState());

  return {
    state,
    results,
    summaries,
    total,
    confidence,
    recommendations,
    trend,
    isDemo: state.mode === 'demo',
    setProfile,
    addActivity,
    removeActivity,
    reset,
    loadDemo
  };
}
