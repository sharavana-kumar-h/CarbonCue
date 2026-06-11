# AI build journey

CarbonCue was built through an AI-assisted, prompt-driven workflow for PromptWars Virtual Main Challenge 3. The implementation intentionally evolved away from a generic carbon calculator toward a behavioral-change prototype with inspectable logic.

## Tools used

- ChatGPT: requirements analysis, architecture pressure-testing, code generation, debugging, test design, documentation and release hardening.
- GitHub: source control and public repository hosting.
- Vercel: static web deployment.
- Local terminal tooling: dependency installation, tests, production builds, repository checks and packaging.

The application itself does not call an external LLM or private API at runtime. That decision avoids exposed API keys and makes the evaluator experience deterministic.

## Prompt evolution

### 1. Initial idea: carbon calculator dashboard

Representative prompt:

```text
Build a carbon footprint awareness platform where users can enter transport, food and electricity usage and see their carbon footprint.
```

Weakness found:

- This would satisfy the surface topic but would be too close to a static calculator.
- It would not prove personalization or behavioral change.

Change made:

- The product direction shifted from “calculate my footprint” to “tell me what to change first and why.”

### 2. Contextual recommendation engine

Representative prompt:

```text
Design the assistant so recommendations depend on the user’s housing, diet, budget and goal instead of showing the same advice to everyone.
```

Weakness found:

- Generic suggestions can become irrelevant, such as asking a vegetarian user to reduce red meat or a renter to buy infrastructure.

Change made:

- Added persona-specific exclusions and ranking logic in `src/engine/rankRecommendations.ts`.
- Recommendations use estimated savings, effort, cost, feasibility, confidence, budget match and user goal.

### 3. Explainable estimates and uncertainty

Representative prompt:

```text
Make the carbon calculations transparent and avoid fake precision. Show assumptions and confidence levels.
```

Weakness found:

- Environmental estimates can look falsely authoritative if numbers are shown without sources and uncertainty.

Change made:

- Emission factors were isolated in `src/data/emissionFactors.ts`.
- Electricity, transport and food values include source metadata and confidence labels.
- The methodology page explains calculation assumptions and limitations.

### 4. Tests, storage hardening and accessibility

Representative prompt:

```text
Add tests that prove the recommendation logic, malformed localStorage validation and evaluator flow work reliably.
```

Weakness found:

- Browser storage cannot be trusted.
- A visually working UI can still fail accessibility or evaluator-path requirements.

Change made:

- Added validation in `src/storage/localStorageRepository.ts`.
- Added automated tests for calculations, recommendations, scenarios, trend logic, storage validation and UI accessibility.
- Added axe-core structural checks for onboarding and the populated dashboard.

### 5. Time-based tracking and evaluator route

Representative prompt:

```text
Add a way to show progress over time and give judges a direct demo route without needing manual setup.
```

Weakness found:

- A one-time dashboard does not prove tracking.
- Evaluators may not spend time entering sample activities.

Change made:

- Added date-aware activity logging, seven-day trend summary and previous-week comparison.
- Added `?demo=1` to open a populated fictional dashboard with a visible sample-data banner.

### 6. Behavioral-change loop

Representative prompt:

```text
Move beyond advice by letting the user commit to one weekly action, receive contextual nudges and mark the result.
```

Weakness found:

- Even ranked recommendations can remain passive if the user cannot commit, act and record completion.

Change made:

- Added a weekly action commitment loop.
- Users can convert a recommendation into a weekly action, see a category-specific nudge after relevant activity appears and mark the action completed or skipped.
- This keeps the MVP local-first while making the behavior-change mechanism more explicit.

## Final architecture summary

```text
UI components
  ↓
useCarbonData state orchestration
  ↓
Pure engines: emissions, recommendations, scenarios, trends, coach responses
  ↓
Validated localStorage adapter
```

The application is deliberately client-side because the current feature set does not require accounts, synchronization or server computation. That keeps the project lightweight, private and easier to evaluate.

## Main trade-offs

- No backend: improves privacy and deployment simplicity but prevents cross-device sync and social leaderboards.
- No runtime AI API: avoids secrets and nondeterminism but limits open-ended conversation.
- Broad food categories: faster logging and better usability but lower precision than ingredient-level lifecycle analysis.
- Local-only storage: good for privacy but not suitable for long-term multi-device analytics.
