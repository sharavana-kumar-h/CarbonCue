import axe from 'axe-core';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App';
import { Onboarding } from '../components/Onboarding';

const axeOptions = {
  rules: {
    // jsdom does not calculate visual contrast; contrast is checked manually in the browser.
    'color-contrast': { enabled: false }
  }
};

describe('accessible evaluator flow', () => {
  it('renders onboarding without detectable structural accessibility violations', async () => {
    const { container } = render(<Onboarding onComplete={() => undefined} onDemo={() => undefined} />);
    const report = await axe.run(container, axeOptions);
    expect(report.violations).toEqual([]);
  });

  it('loads sample data and provides a dynamic coach response', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /explore with sample data/i }));
    expect(screen.getByRole('heading', { name: /see the pattern/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /is the pattern improving/i })).toBeInTheDocument();
    expect(screen.getByText(/lower than last week/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /what is my largest source/i }));
    expect(screen.getByRole('heading', { name: /transport is currently largest/i })).toBeInTheDocument();
  });


  it('opens a populated evaluator dashboard from the direct demo URL', () => {
    window.localStorage.setItem('carboncue:v1', JSON.stringify({
      mode: 'personal',
      profile: { housing: 'owned', householdSize: 1, diet: 'mixed', budget: 'flexible', goal: 'learn' },
      activities: []
    }));
    window.history.replaceState({}, '', '/?demo=1');
    render(<App />);

    expect(screen.getByRole('heading', { name: /see the pattern/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /is the pattern improving/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/sample data notice/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /tell us what you can control/i })).not.toBeInTheDocument();
  });

  it('labels sample data and lets the evaluator return to a clean workspace', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /explore with sample data/i }));
    expect(screen.getByLabelText(/sample data notice/i)).toHaveTextContent(/fictional activity data/i);

    await user.click(screen.getByRole('button', { name: /start with my own data/i }));
    expect(screen.getByRole('heading', { name: /tell us what you can control/i })).toBeInTheDocument();
    expect(window.location.search).toBe('');
  });

  it('does not show a red-meat scenario to the vegetarian demo persona', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /explore with sample data/i }));
    const scenarioSelect = screen.getByRole('combobox', { name: /scenario/i });
    expect(scenarioSelect).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /red-meat/i })).not.toBeInTheDocument();
  });

  it('renders the demo dashboard without detectable structural accessibility violations', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(screen.getByRole('button', { name: /explore with sample data/i }));

    const report = await axe.run(container, axeOptions);
    expect(report.violations).toEqual([]);
  });
});
