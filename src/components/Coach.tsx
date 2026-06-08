import { useMemo, useState } from 'react';
import { Bot, CircleHelp, Leaf, Sparkles } from 'lucide-react';
import { generateCoachResponse, type CoachQuestion } from '../engine/generateCoachResponse';
import type {
  Activity,
  CategorySummary,
  Confidence,
  EmissionResult,
  Recommendation
} from '../types';

interface Props {
  activities: Activity[];
  results: EmissionResult[];
  summaries: CategorySummary[];
  recommendations: Recommendation[];
  confidence: Confidence;
}

const questions: Array<{ id: CoachQuestion; label: string }> = [
  { id: 'next', label: 'What should I do next?' },
  { id: 'largest', label: 'What is my largest source?' },
  { id: 'free', label: 'Give me one free action' },
  { id: 'confidence', label: 'How reliable is this?' }
];

export function Coach({ activities, results, summaries, recommendations, confidence }: Props) {
  const [question, setQuestion] = useState<CoachQuestion>('next');
  const response = useMemo(
    () => generateCoachResponse(question, activities, results, summaries, recommendations, confidence),
    [question, activities, results, summaries, recommendations, confidence]
  );

  return (
    <section className="panel coach-panel" aria-labelledby="coach-title">
      <div className="panel-heading">
        <div><p className="eyebrow">CarbonCue coach</p><h2 id="coach-title">Ask a useful question</h2></div>
        <span className="coach-icon" aria-hidden="true"><Bot size={20} /></span>
      </div>

      <div className="coach-questions" aria-label="Coach questions">
        {questions.map((item) => (
          <button
            type="button"
            key={item.id}
            className={question === item.id ? 'active' : ''}
            aria-pressed={question === item.id}
            onClick={() => setQuestion(item.id)}
          >
            {item.id === 'next' ? <Sparkles size={15} aria-hidden="true" /> : item.id === 'largest' ? <Leaf size={15} aria-hidden="true" /> : <CircleHelp size={15} aria-hidden="true" />}
            {item.label}
          </button>
        ))}
      </div>

      <div className="coach-response" aria-live="polite">
        <p className="coach-label">Coach response</p>
        <h3>{response.heading}</h3>
        <p>{response.body}</p>
        <div className="coach-evidence"><strong>Reasoning:</strong> {response.evidence}</div>
      </div>
    </section>
  );
}
