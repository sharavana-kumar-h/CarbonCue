# LinkedIn post template

I built **CarbonCue** for PromptWars Virtual Main Challenge 3: Carbon Footprint Awareness Platform.

Most personal carbon calculators produce one number and then show generic advice. I wanted to solve the harder problem: **which action is actually relevant for this user, and what mechanism helps them follow through?**

CarbonCue is an explainable carbon coach for urban students and young professionals. It considers housing, household size, diet, budget, personal goal and recorded activities before ranking actions.

## Architecture

```text
React UI components
  ↓
useCarbonData state orchestration
  ↓
Pure decision engines
  - emission calculation
  - recommendation ranking
  - seven-day trend analysis
  - scenario simulation
  - coach responses
  ↓
Validated localStorage adapter
```

No backend or runtime AI API is required for the MVP. That keeps the app private, deterministic and easy for evaluators to inspect.

## What I implemented

- Date-aware transport, meal and electricity tracking
- Seven-day progress view with previous-week comparison
- Confidence labels instead of false precision
- Dynamic coach for “largest source”, “next action”, “free action” and estimate reliability
- Personalized recommendations with a visible reasoning trail
- Weekly action commitment loop with contextual nudges and completion tracking
- What-if scenarios generated from the latest seven-day context
- Direct judge demo route using `?demo=1`
- Browser-only data storage with no account, analytics or exposed API key
- Validation of untrusted browser data
- 31 automated tests, including trend, direct-demo, repository-integrity, weekly-action and axe-core accessibility checks

## AI tools and prompt evolution

I used ChatGPT as the main AI prompting tool for requirements analysis, architecture, implementation planning, debugging, test design and documentation.

The prompt direction evolved through six stages:

1. Basic carbon dashboard → rejected because it was too generic.
2. Contextual recommendation engine → added housing, diet, budget and goal logic.
3. Explainability and confidence → exposed factors and avoided fake precision.
4. Testing and storage hardening → validated localStorage and edge cases.
5. Seven-day tracking and evaluator mode → added progress and a direct demo route.
6. Behavioral-change loop → added weekly commitment, nudges and completion state.

One deliberate engineering choice was **not** to attach an LLM merely to make the product look intelligent. The decision engine is deterministic, testable and inspectable, so every recommendation can be traced to user context and disclosed assumptions.

Live demo: [ADD DEPLOYED LINK]/?demo=1

Start from scratch: [ADD DEPLOYED LINK]

Source code: [ADD GITHUB LINK]

#PromptWars #Sustainability #ClimateTech #ReactJS #TypeScript #Accessibility #BuildInPublic
